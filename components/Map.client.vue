<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapboxOverlay } from '@deck.gl/mapbox/typed'
import { LocateFixed } from 'lucide-vue-next'
import LineLayer from '~/layers/lines.layer'
import type { Bound, Line } from '~/types'

const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([113.863048, 22.575149])
const deckgl = ref<MapboxOverlay | null>(null)

const dataset = useDataset()
interface CityOption {
  id: string
  label: string
  bound: Bound
}
const cities = computed<CityOption[]>(() => dataset.value.map(city => ({ id: city.id, label: `${city.name}(${city.lines.length})`, bound: city.bound })))
const selectedCities = ref<CityOption[]>([cities.value[0]])
const selectedCityIdMap = computed(() => selectedCities.value.reduce<Record<string, true>>((ret, curr) => ({
  ...ret,
  [curr.id]: true,
}), {}))
const zoom = ref<number>(0)

const selectedLine = ref<Line | null>(null)

watch(selectedCities, () => {
  selectedLine.value = null
})

watchEffect(() => {
  const selectedLineLayer = selectedLine.value
    ? new LineLayer({
      id: `selected${selectedLine.value?.id}`,
      data: selectedLine.value,
      stationVisible: true,
      selected: true,
      onClick: () => {
        selectedLine.value = null
      },
    })
    : null

  const nextLines = dataset.value.filter(city => selectedCityIdMap.value[city.id]).map(city => city.lines.map(line => new LineLayer({
    id: line.id,
    data: line,
    visible: !selectedLineLayer,
    stationVisible: zoom.value >= 10,
    onClick() {
      selectedLine.value = line
      map.value.fitBounds(line.bound, {
        padding: {
          top: 25,
          right: 150,
          bottom: 25,
          left: 25,
        },
      })
    },
  })))
  deckgl.value?.setProps({
    layers: [nextLines, selectedLineLayer],
  })
})

async function onMapCreated(mapInstance: any) {
  const DeckOverlay = await import('@deck.gl/mapbox/typed').then(module => module.MapboxOverlay)
  deckgl.value = new DeckOverlay({ getCursor: () => selectedLine ? 'pointer' : 'default' })
  mapInstance.addControl(deckgl.value)

  map.value = mapInstance
}

function onZoomend() {
  zoom.value = map.value.getZoom()
}
</script>

<template>
  <MapboxMap
    class="w-screen h-screen" :access-token="config.MAP_BOX_TOKEN"
    map-style="mapbox://styles/mapbox/light-v10" :center="mapCenter" :zoom="8" @mb-created="onMapCreated" @mb-zoomend="onZoomend"
  />
  <div class="fixed left-4 inset-y-4 z-[2] overflow-y-scroll scrollbar-none">
    <ul class="space-y-2">
      <li
        v-for="city in cities" :key="city.id" class="text-xs text-zinc-300 flex items-center bg-white/90 rounded-2xl p-2 cursor-pointer" :class="selectedCityIdMap[city.id] && 'text-zinc-800'" @click="() => {
          if (selectedCityIdMap[city.id]){
            selectedCities = selectedCities.filter(c => c.id !== city.id)
          }
          else {
            selectedCities.push(city)
          }
        }"
      >
        <span class="mr-2">
          {{ city.label }}
        </span>
        <span class="ml-auto flex items-center space-x-2 opacity-0" :class="selectedCityIdMap[city.id] && 'opacity-100'">
          <!-- <span class="hover:bg-slate-100 rounded-md p-0.5 cursor-pointer">
            <EyeOff :size="11" />
          </span> -->
          <span
            class="hover:bg-slate-100 rounded-md p-0.5 cursor-pointer" @click.stop="() => {
              map.fitBounds(city.bound, { padding: 25 })
            }"
          >
            <LocateFixed :size="11" />
          </span>
        </span>
      </li>
    </ul>
  </div>
  <div v-if="!!selectedLine" class="fixed right-4 top-4 backdrop-blur-lg bg-white p-4 pb-0 rounded-lg min-w-[88px] z-10">
    <h3 class="text-sm text-zinc-700">
      {{ selectedLine.name }}
    </h3>
    <!-- <div class="h-px my-4 mx-2" :style="{ background: `rgb(${selectedLine.color.slice(0, 3)})` }" /> -->
    <div class="max-h-[80vh] overflow-y-scroll scrollbar-none">
      <ul class="mt-3 text-xs space-y-3 text-stone-500 my-2">
        <li v-for="(station, idx) in selectedLine.stations" :key="station.id">
          <span class="inline-block w-2 text-right mr-2" :style="{ color: `rgb(${selectedLine.color.slice(0, 3)})` }">
            {{ idx + 1 }}
          </span>
          {{ station.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
