<script setup lang="ts">
// @ts-expect-error no type provided
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const config = useRuntimeConfig()
</script>

<template>
  <MapboxMap :access-token="config.MAP_BOX_TOKEN" map-style="mapbox://styles/mapbox/streets-v11" :style="{ height: '400px' }">
    <!-- <MapboxMarker position="[0, 0]" /> -->
  </MapboxMap>
</template>
