<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapboxOverlay } from '@deck.gl/mapbox/typed'
import { storeToRefs } from 'pinia'
import LineLayer from '~/layers/lines.layer'

// eslint-disable-next-line unused-imports/no-unused-imports
import type { City, Line, Station } from '~/types'
import { useAppStore } from '~/store/app.store'

const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([113.863048, 22.575149])
const deckgl = ref<MapboxOverlay | null>(null)

const store = useAppStore()
const { dataset, selectedLine, hoveringLine } = storeToRefs(store)
const { selectLine, isCitySelected } = store
const zoom = ref<number>(0)

watchEffect(async () => {
  const selectedLineLayer = selectedLine.value
    ? new LineLayer({
      id: `selected${selectedLine.value?.id}`,
      data: selectedLine.value,
      stationVisible: true,
      selected: true,
      onClick: () => {
        selectLine(null)
      },
    })
    : null

  const hoveringLineLayer = hoveringLine.value
    ? new LineLayer({
      id: `hovering${selectedLine.value?.id}`,
      data: hoveringLine.value,
      stationVisible: false,
      selected: true,
    })
    : null

  const nextLines = dataset.value.filter(isCitySelected).map(city => city.lines.map(line => new LineLayer({
    id: line.id,
    data: line,
    visible: !selectedLineLayer,
    stationVisible: zoom.value >= 10,
    onClick() {
      selectLine(line)
      zoomToLine(line)
    },
  })))

  requestAnimationFrame(() => {
    deckgl.value?.setProps({
      layers: [nextLines, selectedLineLayer, hoveringLineLayer],
    })
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
</script>

<template>
  <MapboxMap
    class="w-screen h-screen" :access-token="config.MAP_BOX_TOKEN"
    map-style="mapbox://styles/mapbox/light-v10" :center="mapCenter" :zoom="8" @mb-created="onMapCreated" @mb-zoomend="onZoomend"
  />
  <section class="relative z-[2]">
    <CitySelect
      @on-zoom="zoomToCity"
    />

    <CityDetail
      @line-select="(line: Line) => {
        zoomToLine(line)
      }"
    />
    <LineDetail
      @station-click="(station:Station) => {
        map.flyTo({
          center: station.coord,
          essential: true,
          zoom: 12,
        })
      }"
    />
  </section>
</template>
