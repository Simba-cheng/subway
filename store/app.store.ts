import { defineStore } from 'pinia'
import type { City, Line } from '~/types'

export const useAppStore = defineStore('app', () => {
  const dataset = useDataset()

  const selectedCities = ref<WeakMap<City, boolean>>(new WeakMap())
  const selectedLine = ref<Line | null>(null)

  const selectCity = (city: City) => {
    selectedCities.value.set(city, true)
  }
  const deselectCity = (city: City) => {
    selectedCities.value.delete(city)
    if (selectedLine.value?.cityId === city.id)
      selectedLine.value = null
  }
  const isSelectCity = (city: City) => selectedCities.value.has(city)
  const toggleCity = (city: City) => isSelectCity(city) ? deselectCity(city) : selectCity(city)

  const selectLine = (line: Line | null) => selectedLine.value = line

  return {
    dataset,
    selectedCities,
    selectedLine,

    selectCity,
    deselectCity,
    isSelectCity,
    toggleCity,
    selectLine,
  }
})
