import { acceptHMRUpdate, defineStore } from 'pinia'
import { useInteractorStore } from './interactor.store'
import type { City } from '~/types'

export const useAppStore = defineStore('app', () => {
  const dataset = useDataset()

  const selectedCities = ref<Set<City>>(new Set())

  const detailCity = ref<City | null>(null)

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
