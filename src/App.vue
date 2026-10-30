<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { registerWidgets } from './runtime/register-widgets'
import { mountWidget } from './runtime/widget-runtime'

const calculatorOne = ref<HTMLElement | null>(null)
const calculatorTwo = ref<HTMLElement | null>(null)

const cleanups: Array<() => void> = []

onMounted(async () => {
  try {
    await registerWidgets()

    if (calculatorOne.value) {
      cleanups.push(
        mountWidget('calculator', calculatorOne.value, {
          config: { initialValue: 10 },
        }),
      )
    }

    if (calculatorTwo.value) {
      cleanups.push(
        mountWidget('calculator', calculatorTwo.value, {
          config: { initialValue: 100 },
        }),
      )
    }
  } catch (error) {
    console.error('Failed to initialize widgets:', error)
  }
})

onUnmounted(() => {
  for (const cleanup of cleanups) {
    cleanup()
  }
})
</script>

<template>
  <main class="mx-auto max-w-xl space-y-8 p-8">
    <h1 class="text-2xl font-bold">CMS Widget Platform</h1>

    <section>
      <h2 class="mb-3 text-lg font-semibold">Calculadora 1</h2>
      <div ref="calculatorOne"></div>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold">Calculadora 2</h2>
      <div ref="calculatorTwo"></div>
    </section>
  </main>
</template>
