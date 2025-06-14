import { acceptHMRUpdate, defineStore } from 'pinia'
import type { City } from '~/types'
import { useInteractorStore } from './interactor.store'

export const useAppStore = defineStore('app', () => {
  const dataset = useDataset()

  const pinnedCities = ref<Set<City>>(new Set())
  const activeCity = ref<City | null>(null)
  const selectedCities = computed(() => {
    const cities = new Set(pinnedCities.value)
    if (activeCity.value)
      cities.add(activeCity.value)
    return cities
  })

  const detailCity = ref<City | null>(null)

  // Initialize default selected cities
  const defaultCityIds = ['4401', '4403', '8100', '4419'] // Guangzhou, Shenzhen, Hong Kong, Dongguan

  // Set default cities when dataset is loaded
  nextTick(() => {
    defaultCityIds.forEach((cityId) => {
      const city = dataset.value.find(c => c.id === cityId)
      if (city)
        pinnedCities.value.add(city)
    })
  })

  const isCityPinned = (city: City) => pinnedCities.value.has(city)
  const isCityActive = (city: City) => activeCity.value === city
  const isCitySelected = (city: City) => isCityPinned(city) || isCityActive(city)

  const setAsActiveCity = (city: City) => {
    activeCity.value = city
  }

  const pinCity = (city: City) => {
    pinnedCities.value.add(city)
    activeCity.value = null
  }

  const unpinCity = (city: City) => {
    pinnedCities.value.delete(city)
  }

  const deselectCity = (city: City) => {
    if (isCityPinned(city))
      unpinCity(city)
    if (isCityActive(city))
      activeCity.value = null

    const { focusedLine, setFocusedLine } = useInteractorStore()
    if (focusedLine?.cityId === city.id)
      setFocusedLine(null)

    if (detailCity.value === city)
      detailCity.value = null
  }

  const toggleCity = (city: City) => {
    if (isCityPinned(city)) {
      unpinCity(city)
    }
    else if (isCityActive(city)) {
      pinCity(city)
    }
    else {
      setAsActiveCity(city)
      useInteractorStore().reset()
    }
  }

  const setDetailCity = (city: City | null) =>
    detailCity.value = city

  return {
    dataset,
    selectedCities,
    detailCity,
    pinnedCities,
    activeCity,

    isCityPinned,
    isCityActive,
    isCitySelected,
    toggleCity,
    setDetailCity,
    pinCity,
    unpinCity,
    deselectCity,
    setAsActiveCity,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
