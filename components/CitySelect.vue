<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Github, List, MapPin, MapPinOff, Twitter } from 'lucide-vue-next'
import { useAppStore } from '~/store/app.store'
import type { City } from '~/types'

const emits = defineEmits<{
  (e: 'city-select', city: City): void
  (e: 'city-unselect', city: City): void
  (e: 'on-zoom', city: City): void
}>()

const store = useAppStore()
const { isCitySelected, toggleCity, setDetailCity, isCityPinned, isCityActive, setActiveCity } = store
const { dataset, selectedCities } = storeToRefs(store)
const isOpen = ref(true)

watchEffect(() => {
  if (selectedCities.value.size === 0)
    isOpen.value = true
})
</script>

<template>
  <div class=" bg-white rounded text-zinc-800 text-xs p-2 pb-2 flex flex-col flex-1 max-h-full">
    <!-- Social Media Links Header -->
    <header class="flex justify-center items-center gap-2 pb-2 mb-2 border-b border-zinc-100">
      <a
        href="https://github.com/thecuvii/subway"
        target="_blank"
        rel="noopener noreferrer"
        class="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded hover:bg-zinc-50"
        title="GitHub"
      >
        <Github :size="14" />
      </a>
      <a
        href="https://x.com/thecuvii"
        target="_blank"
        rel="noopener noreferrer"
        class="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded hover:bg-zinc-50"
        title="X (Twitter)"
      >
        <Twitter :size="14" />
      </a>
    </header>

    <section class="grow overflow-scroll scrollbar-none" :class="!isOpen && `max-h-0`">
      <ul class="select-none">
        <li
          v-for="city in dataset" :key="city.id"
          class="group text-xs text-zinc-400 p-1 flex items-center cursor-pointer hover:bg-zinc-100 rounded hover:text-zinc-500"
          @click="() => {
            setActiveCity(city)
            emits('city-select', city)
          }"
        >
          <span>

            {{ city.name }}
          </span>
          <span class="flex ml-auto space-x-1 items-center opacity-0 pointer-events-none" :class="isCitySelected(city) && 'opacity-100 pointer-events-auto'">
            <span
              class="p-0.5 cursor-pointer" @click.stop="() => {
                setDetailCity(city)
              }"
            >
              <List class="hover:scale-125" :size="12" />
            </span>
            <span
              class="cursor-pointer" @click.stop="() => {
                toggleCity(city)
                emits('city-unselect', city)
              }"
            >
              <MapPin v-if="isCityActive(city)" class="text-blue-500 hover:scale-125 transition-transform" :size="12" />
              <MapPinOff v-else-if="isCityPinned(city)" class="text-red-500 hover:scale-125 transition-transform" :size="12" />
            </span>
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>
