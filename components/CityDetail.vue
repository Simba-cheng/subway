<script setup lang="ts">
import type { City, Line } from '~/types'

const props = defineProps<{
  city: City
}>()

const emits = defineEmits<{
  (e: 'line-select', line: Line): void
}>()
</script>

<template>
  <div class="fixed left-36 top-4 bg-white text-xs p-2 rounded-lg">
    <h3>{{ props.city.name }}线路</h3>
    <ul class="text-zinc-600 space-y-1 mt-2">
      <li v-for="line in props.city.lines" :key="line.id" class="cursor-pointer relative flex items-center" @click="() => emits('line-select', line)">
        <div class="h-1 w-1 rounded-full mr-1" :style="{ background: `rgb(${line.color.slice(0, 3)})` }" />
        {{ line.name }}
        <!-- <div class="w-2 h-1 absolute left-0 bottom-0 opacity-25" :style="{ background: `rgb(${line.color.slice(0, 3)})` }" /> -->
      </li>
    </ul>
  </div>
</template>
