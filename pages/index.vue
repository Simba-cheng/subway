<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { type LayersList } from '@deck.gl/core/typed'
import hexRGB from 'hex-rgb'
import subway from '~/datasource/subway.json'

const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([113.863048, 22.575149])

watch(map, async (map) => {
  const { ScatterplotLayer } = await import('@deck.gl/layers/typed')
  const DeckOverlay = await import('@deck.gl/mapbox/typed').then(module => module.MapboxOverlay)

  const layers: LayersList[] = []
  subway.forEach((city) => {
    const cityLayer: LayersList = []
    city.lines.forEach((line) => {
      const lineColor = hexRGB(line.color, { format: 'array', alpha: 255 })

      cityLayer.push(new ScatterplotLayer({
        id: `${city.cityname}${line.name} stations`,
        data: line.stations,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        // 换乘站点特殊样式
        radiusScale: 12,
        radiusMinPixels: 4,
        radiusMaxPixels: 6,
        lineWidthMinPixels: 1,
        getPosition(data) {
          return transformGCJ02(transformStringToGCJ02(data.coord))
        },
        getFillColor: lineColor,
      }))
    })

    layers.push(cityLayer)
  })

  const deckgl = new DeckOverlay({
    // initialViewState: INITIAL_VIEW_STATE,
    // controller: true,

    layers,
  })

  map.addControl(deckgl)
})
</script>

<template>
  <MapboxMap :style="{ height: '100vh', width: '100vw' }" :access-token="config.MAP_BOX_TOKEN" map-style="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json" :center="mapCenter" :zoom="8" @mb-created="(mapboxInstance:any) => map = mapboxInstance">
    <!-- <MapboxMarker position="[0, 0]" /> -->
  </MapboxMap>
</template>
