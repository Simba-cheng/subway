<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/store/app.store'
import type { Station } from '~/types'

const emits = defineEmits<{
  (e: 'station-click', station: Station): void
}>()

const store = useAppStore()
const { selectedLine } = storeToRefs(store)
</script>

<template>
  <div v-if="!!selectedLine" class="fixed right-4 top-4 backdrop-blur-lg bg-white py-4 pb-0 rounded-lg min-w-[70px]">
    <h3 class="text-center text-xs text-zinc-700">
      {{ selectedLine.name }}
    </h3>
    <div class="max-h-[80vh] overflow-y-scroll scrollbar-none">
      <ul class="mt-3 text-xs text-stone-500 my-2 px-1">
        <li
          v-for="(station, idx) in selectedLine.stations" :key="station.id" class="hover:bg-zinc-100 rounded p-1.5 cursor-pointer" @click="() => {
            emits('station-click', station)
          }"
        >
          <span class="inline-block w-2 text-right mr-2" :style="{ color: `rgb(${selectedLine.color.slice(0, 3)})` }">
            {{ idx + 1 }}
          </span>
          {{ station.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
