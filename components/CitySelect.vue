<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ChevronUp, List, X } from 'lucide-vue-next'
import { useAppStore } from '~/store/app.store'
import type { City } from '~/types'

const emits = defineEmits<{
  (e: 'city-select', city: City): void
  (e: 'city-unselect', city: City): void
  (e: 'on-zoom', city: City): void
}>()

const store = useAppStore()
const { isCitySelected, selectCity, deselectCity, setDetailCity } = store
const { dataset, selectedCities } = storeToRefs(store)
const isOpen = ref(true)

watchEffect(() => {
  if (selectedCities.value.size === 0)
    isOpen.value = true
})
</script>

<template>
  <div class=" bg-white rounded text-zinc-800 text-xs p-2 pb-2 flex flex-col flex-1 max-h-full">
    <ul v-if="selectedCities.size">
      <li
        v-for="city in selectedCities" :key="city.id" class="hover:bg-zinc-100 rounded py-1 px-1 cursor-pointer flex" @click="() => {
          emits('on-zoom', city)
        }"
      >
        <span class="mr-2 select-none">
          {{ city.name }}
        </span>
        <span class="flex ml-auto space-x-1 items-center">
          <span
            class="p-0.5 cursor-pointer" @click.stop="() => {
              setDetailCity(city)
            }"
          >
            <List class="hover:scale-125" :size="12" />
          </span>
          <span
            class="cursor-pointer" @click.stop="() => {
              deselectCity(city)
              emits('city-unselect', city)
            }"
          >
            <X class="text-red-500 hover:scale-125 transition-transform" :size="12" />
          </span>
        </span>
      </li>
    </ul>
    <div v-if="selectedCities.size" class="my-1 flex justify-center">
      <ChevronUp :size="14" class="transition-transform cursor-pointer" :class="!isOpen && 'rotate-180'" @click="() => isOpen = !isOpen" />
    </div>
    <section class="grow overflow-scroll scrollbar-none" :class="!isOpen && `max-h-0`">
      <ul class="select-none">
        <li
          v-for="city in dataset.filter(city => !isCitySelected(city))" :key="city.id" class="group text-xs text-zinc-400 p-1 flex items-center cursor-pointer hover:bg-zinc-100 rounded hover:text-zinc-500"
          @click="() => {
            selectCity(city)
            emits('city-select', city)
          }"
        >
          {{ city.name }}
        </li>
      </ul>
    </section>
  </div>
</template>
