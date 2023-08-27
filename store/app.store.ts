import { acceptHMRUpdate, defineStore } from 'pinia'
import type { City, Line, Station } from '~/types'

export const useAppStore = defineStore('app', () => {
  const dataset = useDataset()

  const selectedCities = ref<Set<City>>(new Set())
  const selectedLine = ref<Line | null>(null)
  const detailCity = ref<City | null>(null)
  const hoveringLine = ref<Line | null>(null)
  const hoveringStation = ref<Station | null>(null)

  const selectCity = (city: City) => {
    selectedCities.value.add(city)

    hoveringLine.value = null
    hoveringStation.value = null
    selectedLine.value = null
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

  const selectLine = (line: Line | null) => {
    selectedLine.value = line
    hoveringLine.value = null
    hoveringStation.value = null
  }
  const setDetailCity = (city: City | null) =>
    detailCity.value = city
  const setHoveringLine = (line: Line | null) => {
    if (selectedLine.value)
      return
    hoveringLine.value = line
  }
  const setHoveringStation = (station: Station | null, line: Line | null) => {
    if (selectedLine.value)
      return

    hoveringStation.value = station
    station && (hoveringLine.value = line)
  }
  const resetSelection = () => {
    selectedLine.value = null
    hoveringLine.value = null
    hoveringStation.value = null
  }

  return {
    dataset,
    selectedCities,
    detailCity,
    selectedLine,
    hoveringLine,
    hoveringStation,

    selectCity,
    deselectCity,
    isCitySelected,
    toggleCity,
    selectLine,
    setDetailCity,
    setHoveringLine,
    setHoveringStation,
    resetSelection,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
