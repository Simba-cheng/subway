<script setup lang="ts">
import { Github } from 'lucide-vue-next'

// Custom X Icon component
function XIcon() {
  return h('svg', {
    class: 'w-3.5 h-3.5',
    fill: 'currentColor',
    viewBox: '0 0 1200 1227',
    xmlns: 'http://www.w3.org/2000/svg',
  }, [
    h('path', {
      d: 'M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z',
    }),
  ])
}
</script>

<template>
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
      <XIcon />
    </a>
  </header>
</template>
