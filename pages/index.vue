<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const AIR_PORTS
  = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson'
const config = useRuntimeConfig()
const map = ref()
const mapCenter = ref([0.45, 51.47])

watch(map, async (map) => {
  const INITIAL_VIEW_STATE = {
    latitude: 37.8,
    longitude: -122.45,
    zoom: 4,
  }

  const { GeoJsonLayer, ArcLayer } = await import('@deck.gl/layers/typed').then(modules => ({ GeoJsonLayer: modules.GeoJsonLayer, ArcLayer: modules.ArcLayer }))
  const DeckOverlay = await import('@deck.gl/mapbox/typed').then(module => module.MapboxOverlay)

  const deckgl = new DeckOverlay({
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [
      new GeoJsonLayer({
        id: 'airports',
        data: AIR_PORTS,
        // Styles
        filled: true,
        pointRadiusMinPixels: 2,
        pointRadiusScale: 2000,
        getPointRadius: f => 11 - f.properties.scalerank,
        getFillColor: [200, 0, 80, 180],
        // Interactive props
        pickable: true,
        autoHighlight: true,
        onClick: info =>
          info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`),
      }),
      new ArcLayer({
        id: 'arcs',
        data: AIR_PORTS,
        dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
        // Styles
        getSourcePosition: f => [-0.4531566, 51.4709959], // London
        getTargetPosition: f => f.geometry.coordinates,
        getSourceColor: [0, 128, 200],
        getTargetColor: [200, 0, 80],
        getWidth: 1,
      }),
    ],
  })

  map.addControl(deckgl)
})
</script>

<template>
  <MapboxMap :style="{ height: '100vh' }" :access-token="config.MAP_BOX_TOKEN" map-style="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json" :center="mapCenter" :zoom="8" @mb-created="(mapboxInstance:any) => map = mapboxInstance">
    <!-- <MapboxMarker position="[0, 0]" /> -->
  </MapboxMap>
</template>
