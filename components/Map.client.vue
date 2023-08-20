<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapboxOverlay } from '@deck.gl/mapbox/typed'
import LineLayer from '~/layers/lines.layer'

const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([113.863048, 22.575149])
const deckgl = ref<MapboxOverlay | null>(null)

const dataset = useDataset()
interface CityOption {
  id: string
  label: string
}
const cities = computed<CityOption[]>(() => dataset.value.map(city => ({ id: city.id, label: `${city.name}(${city.lines.length})` })))
const selectedCities = ref<CityOption[]>([cities.value[0]])
const selectedCityIdMap = computed(() => selectedCities.value.reduce<Record<string, true>>((ret, curr) => ({
  ...ret,
  [curr.id]: true,
}), {}))

watchEffect(() => {
  const nextLayer = dataset.value.filter(city => selectedCityIdMap.value[city.id]).map(city => city.lines.map(line => new LineLayer({
    id: line.id,
    data: line,
  })))

  deckgl.value?.setProps({
    layers: [...nextLayer],
  })
})

async function onMapCreated(mapInstance: any) {
  const DeckOverlay = await import('@deck.gl/mapbox/typed').then(module => module.MapboxOverlay)
  deckgl.value = new DeckOverlay({ })
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
  <div class="fixed left-4 top-4 z-[2]">
    <USelectMenu v-model="selectedCities" :options="cities" multiple>
      <template #label>
        <div class="max-w-[88px] truncate">
          {{ selectedCities.map(s => s.label).join(',') }}
        </div>
      </template>
    </USelectMenu>
  </div>
</template>
