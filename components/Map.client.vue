<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapboxOverlay } from '@deck.gl/mapbox/typed'
import { LocateFixed, MenuSquare } from 'lucide-vue-next'
import LineLayer from '~/layers/lines.layer'
import type { City, Line } from '~/types'

const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([113.863048, 22.575149])
const deckgl = ref<MapboxOverlay | null>(null)

const dataset = useDataset()

const selectedCities = ref<WeakMap<City, boolean>>(new WeakMap())
const detailCity = ref<City | null>(null)
const zoom = ref<number>(0)

const selectedLine = ref<Line | null>(null)

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

  const nextLines = dataset.value.filter(city => selectedCities.value.has(city)).map(city => city.lines.map(line => new LineLayer({
    id: line.id,
    data: line,
    visible: !selectedLineLayer,
    stationVisible: zoom.value >= 10,
    onClick() {
      selectedLine.value = line
      zoomToLine(line)
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

function zoomToCity(city: City) {
  selectedLine.value = null
  map.value.fitBounds(city.bound, { padding: 25 })
}

function zoomToLine(line: Line) {
  map.value.fitBounds(line.bound, {
    padding: {
      top: 25,
      right: 150,
      bottom: 25,
      left: 25,
    },
  })
}

const isControlPressing = useKeyModifier('Meta')
</script>

<template>
  <MapboxMap
    class="w-screen h-screen" :access-token="config.MAP_BOX_TOKEN"
    map-style="mapbox://styles/mapbox/light-v10" :center="mapCenter" :zoom="8" @mb-created="onMapCreated" @mb-zoomend="onZoomend"
  />
  <section class="relative z-[2]">
    <div class="fixed left-4 inset-y-4 overflow-y-scroll scrollbar-none">
      <ul class="space-y-2">
        <li
          v-for="city in dataset" :key="city.id" class="text-xs text-zinc-300 flex items-center bg-white/90 rounded-2xl p-2 cursor-pointer"
          :class="{
            'text-zinc-800': selectedCities.has(city),
            'cursor-zoom-in': isControlPressing,
          }" @click="(e) => {
            if (selectedCities.has(city)) {
              selectedCities.delete(city)
              if (detailCity === city){ detailCity = null }
              if (selectedLine?.cityId === city.id){
                selectedLine = null
              }
            }
            else {
              zoomToCity(city)
              detailCity = city;
              selectedCities.set(city, true)
            }
          }"
        >
          <span class="mr-2">
            {{ city.name }}
          </span>
          <span class="ml-auto flex items-center space-x-2 opacity-0" :class="selectedCities.has(city) && 'opacity-100'">
            <span
              class="hover:bg-slate-100 rounded-md p-0.5 cursor-pointer" @click.stop="() => {
                detailCity = city
              }"
            >
              <MenuSquare :size="11" />
            </span>
            <span
              class="hover:bg-slate-100 rounded-md p-0.5 cursor-pointer" @click.stop="() => {
                selectedLine = null
                map.fitBounds(city.bound, { padding: 25 })
              }"
            >
              <LocateFixed :size="11" />
            </span>
          </span>
        </li>
      </ul>
    </div>

    <CityDetail
      v-if="!!detailCity"
      :city="detailCity"
      @line-select="(line: Line) => {
        selectedLine = line;
        zoomToLine(line)
      }"
      @close="() => detailCity = null"
    />
    <div v-if="!!selectedLine" class="fixed right-4 top-4 backdrop-blur-lg bg-white py-4 pb-0 rounded-lg min-w-[70px]">
      <h3 class="text-center text-sm text-zinc-700">
        {{ selectedLine.name }}
      </h3>
      <!-- <div class="h-px my-4 mx-2" :style="{ background: `rgb(${selectedLine.color.slice(0, 3)})` }" /> -->
      <div class="max-h-[80vh] overflow-y-scroll scrollbar-none">
        <ul class="mt-3 text-xs text-stone-500 my-2 px-1">
          <li
            v-for="(station, idx) in selectedLine.stations" :key="station.id" class="hover:bg-zinc-100 rounded p-1.5 cursor-pointer" @click="() => {
              // map.fitBounds(selectedLine.bound, {
              //   padding: {
              //     top: 25,
              //     right: 150,
              //     bottom: 25,
              //     left: 25,
              //   },
              // })
              map.flyTo({
                center: station.coord,
                essential: true,
                zoom: 12,
              })
            }"
          >
            <span class="inline-block w-2 text-right mr-2" :style="{ color: `rgb(${selectedLine.color.slice(0, 3)})` }">
              {{ idx + 1 }}
            </span>
            {{ station.name }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
