import { defineStore } from 'pinia'
import type { City, Line } from '~/types'

export const useAppStore = defineStore('app', () => {
  const dataset = useDataset()

  const selectedCities = ref<WeakMap<City, boolean>>(new WeakMap())
  const selectedLine = ref<Line | null>(null)
  const detailCity = ref<City | null>(null)

  const selectCity = (city: City) => {
    selectedCities.value.set(city, true)
  }
  const deselectCity = (city: City) => {
    selectedCities.value.delete(city)
    if (selectedLine.value?.cityId === city.id)
      selectedLine.value = null

    if (detailCity.value === city)
      detailCity.value = null
  }
  const isCitySelected = (city: City) => selectedCities.value.has(city)
  const toggleCity = (city: City) => isCitySelected(city) ? deselectCity(city) : selectCity(city)

  const selectLine = (line: Line | null) => selectedLine.value = line
  const setDetailCity = (city: City | null) =>
    detailCity.value = city

  return {
    dataset,
    selectedCities,
    detailCity,
    selectedLine,

    selectCity,
    deselectCity,
    isCitySelected,
    toggleCity,
    selectLine,
    setDetailCity,
  }
})
