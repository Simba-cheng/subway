<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'
import type { City, Line } from '~/types'

const props = defineProps<{
  city: City
}>()

const emits = defineEmits<{
  (e: 'line-select', line: Line): void
  (e: 'close',): void
}>()
</script>

<template>
  <div class="fixed left-36 top-4 bg-white text-xs p-2 rounded-lg">
    <h3 class="flex items-center">
      <span>{{ props.city.name }}线路</span>
      <XCircle class="ml-auto cursor-pointer" :size="12" @click="() => emits('close')" />
    </h3>
    <ul class="text-zinc-600 space-y-1 mt-2">
      <li v-for="line in props.city.lines" :key="line.id" class="relative" @click="() => emits('line-select', line)">
        <div class="hover:bg-zinc-200 rounded px-2 py-1 flex items-center cursor-pointer ">
          <div class="h-1 w-1 rounded-full mr-1" :style="{ background: `rgb(${line.color.slice(0, 3)})` }" />
          {{ line.name }}
          <!-- <div class="w-2 h-1 absolute left-0 bottom-0 opacity-25" :style="{ background: `rgb(${line.color.slice(0, 3)})` }" /> -->
        </div>
      </li>
    </ul>
  </div>
</template>
