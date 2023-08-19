<script setup lang="ts">
import type { City, CitySelections } from '~/types'

const props = defineProps<{ cities: CitySelections }>()

const emits = defineEmits<{
  (e: 'select', selected: City[]): void
}>()

const selected = ref<City[]>([props.cities?.[0]])

watch(selected, (s) => {
  emits('select', s)
})
</script>

<template>
  <div class="fixed left-4 top-4 z-[2]">
    <USelectMenu v-model="selected" :options="props.cities" multiple>
      <template #label>
        <div class="max-w-[88px] truncate">
          {{ selected.map(s => s.label).join(',') }}
        </div>
      </template>
    </USelectMenu>
  </div>
</template>
