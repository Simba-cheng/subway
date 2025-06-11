import { acceptHMRUpdate, defineStore } from 'pinia'
import type { City } from '~/types'
import { useInteractorStore } from './interactor.store'

export const useAppStore = defineStore('app', () => {
  const dataset = useDataset()

  const selectedCities = ref<Set<City>>(new Set())

  const detailCity = ref<City | null>(null)

  // Initialize default selected cities
  const defaultCityIds = ['4401', '4403', '8100', '4419'] // Guangzhou, Shenzhen, Hong Kong, Dongguan

  // Set default cities when dataset is loaded
  nextTick(() => {
    defaultCityIds.forEach((cityId) => {
      const city = dataset.value.find(c => c.id === cityId)
      if (city)
        selectedCities.value.add(city)
    })
  })

  const selectCity = (city: City) => {
    selectedCities.value.add(city)
    useInteractorStore().reset()
  }
  const deselectCity = (city: City) => {
    selectedCities.value.delete(city)
    const { focusedLine, setFocusedLine } = useInteractorStore()
    if (focusedLine?.cityId === city.id)
      setFocusedLine(null)

    if (detailCity.value === city)
      detailCity.value = null
  }
  const isCitySelected = (city: City) => selectedCities.value.has(city)
  const toggleCity = (city: City) => isCitySelected(city) ? deselectCity(city) : selectCity(city)

  const setDetailCity = (city: City | null) =>
    detailCity.value = city

  return {
    dataset,
    selectedCities,
    detailCity,

    selectCity,
    deselectCity,
    isCitySelected,
    toggleCity,
    setDetailCity,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
