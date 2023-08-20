<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapboxOverlay } from '@deck.gl/mapbox/typed'
import type { City } from '~/types'
import LineLayer from '~/layers/lines.layer'

const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([113.863048, 22.575149])
const deckgl = ref<MapboxOverlay | null>(null)

const visibleCities = ref<City[]>([])

const dataset = useDataset()

async function onMapCreated(mapInstance: any) {
  const DeckOverlay = await import('@deck.gl/mapbox/typed').then(module => module.MapboxOverlay)

  deckgl.value = new DeckOverlay({ layers: dataset.value.map(city => city.lines.map(line => new LineLayer({ line }))) })
  mapInstance.addControl(deckgl.value)

  map.value = mapInstance
}
</script>

<template>
  <MapboxMap
    :style="{ height: '100vh', width: '100vw' }" :access-token="config.MAP_BOX_TOKEN"
    map-style="mapbox://styles/mapbox/light-v10" :center="mapCenter" :zoom="8" @mb-created="onMapCreated"
  >
    <!-- <MapboxMarker position="[0, 0]" /> -->
  </MapboxMap>
  <!-- <Selection :cities="cities" @select="(s) => visibleCities = s" /> -->
</template>
