<script setup lang="ts">
import { LocateFixed, MenuSquare } from 'lucide-vue-next'
import { useAppStore } from '~/store/app.store'
import type { City } from '~/types'

const emits = defineEmits<{
  (e: 'city-select', city: City): void
  (e: 'city-unselect', city: City): void
  (e: 'on-zoom', city: City): void
}>()

const { dataset, isCitySelected, selectCity, deselectCity, setDetailCity, selectLine } = useAppStore()
</script>

<template>
  <div class="fixed left-4 inset-y-4 overflow-y-scroll scrollbar-none">
    <ul class="space-y-2">
      <li
        v-for="city in dataset" :key="city.id" class="text-xs text-zinc-400 flex items-center bg-white/90 rounded-2xl p-2 cursor-pointer"
        :class="{
          'text-zinc-800': isCitySelected(city),
        }" @click="() => {
          if (isCitySelected(city)) {
            deselectCity(city)
            emits('city-unselect', city)
          }
          else {
            selectCity(city)
            emits('city-select', city)
          }
        }"
      >
        <span class="mr-2">
          {{ city.name }}
        </span>
        <span class="ml-auto flex items-center space-x-2 opacity-0 pointer-events-none" :class="isCitySelected(city) && 'opacity-100 pointer-events-auto'">
          <span
            class="hover:bg-slate-100 rounded-md p-0.5 cursor-pointer" @click.stop="() => {
              setDetailCity(city)
            }"
          >
            <MenuSquare :size="11" />
          </span>
          <span
            class="hover:bg-slate-100 rounded-md p-0.5 cursor-pointer" @click.stop="() => {
              selectLine(null)
              emits('on-zoom', city)
            }"
          >
            <LocateFixed :size="11" />
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
