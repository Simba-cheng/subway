<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { type LayersList } from '@deck.gl/core/typed'
import hexRgb from 'hex-rgb'
import type { MapboxOverlay } from '@deck.gl/mapbox/typed'
import subway from '~/datasource/data.json'
import type { City, CitySelections } from '~/types'
import Selection from '~/components/Selection.vue'

const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([113.863048, 22.575149])
const deckgl = ref<MapboxOverlay | null>(null)

const cities = ref<CitySelections>(subway.map(city => ({ id: city.id, label: `${city.name}(${city.lines.length})`, lines: city.lines.map(line => ({ id: line.id, name: line.name, color: line.color })) })))
const visibleCities = ref<City[]>([])

watch(visibleCities, async (cities) => {
  const { ScatterplotLayer, PathLayer } = await import('@deck.gl/layers/typed')

  const layers: LayersList[] = []
  subway.filter(city => cities.some(c => c.id === city.id)).forEach((city) => {
    const cityLayer: LayersList = []
    // TODO 所有layer可以提前创建好
    city.lines.forEach((line) => {
      const lineColor = hexRgb(line.color, { format: 'array', alpha: 255 })

      cityLayer.push(new ScatterplotLayer({
        id: city.id,
        data: line.stations,
        opacity: 0.8,
        stroked: true,
        filled: true,
        // 换乘站点特殊样式
        radiusScale: 12,
        radiusMinPixels: 2,
        radiusMaxPixels: 2,
        lineWidthMinPixels: 1,
        getPosition(data) {
          return transformGCJ02([data.lng, data.lat])
        },
        getFillColor: lineColor,
      }))

      if (line.polyline?.length || line.fullPolyline.length) {
        const polylineData = line.fullPolyline.length ? line.fullPolyline : extractPolyline(line.polyline)
        cityLayer.push(new PathLayer<[number, number][]>({
          id: line.id,
          data: polylineData,

          getPath: d => polylineData as [number, number][],
          getColor: d => lineColor,
          getWidth: d => 5,
          pickable: false,
          autoHighlight: false,
          widthScale: 15,
          widthMinPixels: 2,
          widthMaxPixels: 3,
        }))
      }
    })

    layers.push(cityLayer)
  })
  deckgl.value?.setProps({ layers })
})

async function onMapCreated(mapInstance: any) {
  const DeckOverlay = await import('@deck.gl/mapbox/typed').then(module => module.MapboxOverlay)

  deckgl.value = new DeckOverlay({ layers: [] })
  mapInstance.addControl(deckgl.value)

  map.value = mapInstance
}
</script>

<template>
  <MapboxMap :style="{ height: '100vh', width: '100vw' }" :access-token="config.MAP_BOX_TOKEN" map-style="mapbox://styles/mapbox/light-v10" :center="mapCenter" :zoom="8" @mb-created="onMapCreated">
    <!-- <MapboxMarker position="[0, 0]" /> -->
  </MapboxMap>
  <Selection :cities="cities" @select="(s) => visibleCities = s" />
</template>
