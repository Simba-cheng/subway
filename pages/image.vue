<script lang="ts" setup>
import { geoCentroid, geoMercator, geoPath } from 'd3-geo'
import { useAppStore } from '~/store/app.store'
import type { Bound, City } from '~/types'

const { dataset } = useAppStore()
const selectedCity = ref<City | null>(null)

const bounds = computed(() => {
  if (!selectedCity.value)
    return null
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity

  for (const line of selectedCity.value?.lines) {
    for (const [lng, lat] of line.polyline) {
      if (lng < minLng)
        minLng = lng
      if (lng > maxLng)
        maxLng = lng
      if (lat < minLat)
        minLat = lat
      if (lat > maxLat)
        maxLat = lat
    }
  }

  return [[minLng, minLat], [maxLng, maxLat]] as Bound
})

const size = computed(() => {
  if (!bounds.value)
    return
  const baseWidth = window.innerWidth
  const ratio = (bounds.value[1][1] - bounds.value[0][1]) / (bounds.value[1][0] - bounds.value[0][0])
  return {
    width: baseWidth,
    height: baseWidth * ratio,
  }
})

const pathGenerator = computed(() => {
  if (!selectedCity.value?.lines || !size.value)
    return
  const projection
  = geoMercator()
    .center(geoCentroid({ type: 'LineString', coordinates: selectedCity.value.lines.map(l => l.polyline).flat() })) // 地图中心点
    .scale(100000) // 缩放比例
    .translate([size.value.width / 2, size.value.height / 2]) // 平移

  // 创建 path 生成器
  return geoPath().projection(projection)
})

const svgPath = computed(() => {
  if (!bounds.value || !selectedCity.value || !size.value || !pathGenerator.value)
    return

  const path: { id: string; d: string; stroke: number[] }[] = []
  for (const line of selectedCity.value?.lines) {
    path.push({
      id: line.id,
      d: pathGenerator.value({
        type: 'LineString',
        coordinates: line.polyline,
      }) || '',
      stroke: line.color as any,
    })
  }
  return path
})
</script>

<template>
  <select
    name="city" @change="(e) => {
      // @ts-ignore
      const id = e.target.value;

      selectedCity = (dataset.find(city => city.id === id) || null)
    }"
  >
    <option v-for="city in dataset" :key="city.id" :value="city.id">
      {{ city.name }}
    </option>
  </select>
  <svg class="p-2" :width="size?.width || 0" :height=" size?.height || 0" style="border:1px solid #000000;">
    <path v-for="path in svgPath" :key="path.id" :d="path.d" :style="{ stroke: `rgba(${path.stroke})` }" stroke-width="2" fill="none" />
  </svg>
</template>
