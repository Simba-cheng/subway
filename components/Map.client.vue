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
import StationsLayer from '~/layers/stations.layer'
import LineDetailLayer from '~/layers/line-detail.layer'

const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([113.863048, 22.575149])
const deckgl = ref<MapboxOverlay | null>(null)

const store = useAppStore()
const { dataset, selectedLine, hoveringLine, hoveringStation, selectedCities } = storeToRefs(store)
const { selectLine, setDetailCity } = store
const zoom = ref<number>(0)

watchEffect(async () => {
  const selectedLineLayer = selectedLine.value
    ? new LineDetailLayer({
      id: 'hoveringline',
      data: selectedLine.value,
      pickable: true,
      labels: true,
      onClick() {
        selectLine(null)
      },
    })
    : null

  const hoveringLineLayer = hoveringLine.value
    ? new LineDetailLayer({
      id: 'hoveringline',
      data: hoveringLine.value,
      pickable: true,
      onClick() {
        selectLine(hoveringLine.value!)
        zoomToLine(hoveringLine.value!)
      },
    })
    : null

  const cities = dataset.value.filter(city => selectedCities.value.has(city))

  const lineLayers = cities.map(city => city.lines.map(line => [new LineLayer({
    id: line.id,
    data: line,
    visible: !selectedLine.value,
  }), new StationsLayer({ id: `${line.id}-stations`, data: line, visible: !selectedLine.value && zoom.value >= 10 })]))

  requestAnimationFrame(() => {
    deckgl.value?.setProps({
      layers: [lineLayers, selectedLineLayer, hoveringLineLayer],
    })
  })
})

const hoverPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 })

async function onMapCreated(mapInstance: any) {
  const DeckOverlay = await import('@deck.gl/mapbox/typed').then(module => module.MapboxOverlay)
  deckgl.value = new DeckOverlay({
    debug: true,
    pickingRadius: 4,
    onHover: (info) => {
      const source = info.sourceLayer?.root.props.data as Line
      const isHoveringOnStation = info.sourceLayer?.id === 'detail-stations'
      useAppStore().setHoveringLine(source || null)
      if (isHoveringOnStation)
        useAppStore().setHoveringStation(source.stations.find(station => station.id === info.object?.id) || null, source)
      else
        useAppStore().setHoveringStation(null, null)

      hoverPosition.value = { x: info.x, y: info.y }
    },
    onDragStart: () => {
      hoveringLine.value = null
    },
  })
  mapInstance.addControl(deckgl.value)

  map.value = mapInstance
}

function onZoomend() {
  zoom.value = map.value.getZoom()
}

function zoomToCity(city: City) {
  map.value.fitBounds(city.bound, { padding: 25, duration: 800 })
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
    map-style="mapbox://styles/mapbox/light-v10?optimize=true" :center="mapCenter" :zoom="8" @mb-created="onMapCreated" @mb-zoomend="onZoomend"
  />
  <section class="relative z-[2]">
    <CitySelect
      @on-zoom="zoomToCity"
      @city-select="zoomToCity"
    />

    <CityDetail
      @line-select="(line: Line) => {
        zoomToLine(line)
      }"
      @close="() => setDetailCity(null)"
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
  <div v-if="hoveringLine && hoverPosition.x > 0" class="fixed left-0 top-0 will-change-transform z-10 text-xs bg-white/90 p-1 rounded-lg" :style="{ transform: `translate(${hoverPosition.x + 10}px, ${hoverPosition.y + 10}px)` }">
    {{ hoveringLine.name }} <span class="font-semibold">
      {{ hoveringStation ? `/ ${hoveringStation.name}` : '' }}
    </span>
  </div>
</template>
