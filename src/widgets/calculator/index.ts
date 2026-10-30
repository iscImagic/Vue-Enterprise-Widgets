import { createApp, h, ref } from 'vue'
import type { WidgetInstance, WidgetModule, WidgetMountOptions } from '@/runtime/widget-contract'

export const calculatorWidget: WidgetModule = {
  mount(element: HTMLElement, options?: WidgetMountOptions): WidgetInstance {
    const initialValue = Number(options?.config?.initialValue ?? 0)

    const app = createApp({
      setup() {
        const firstNumber = ref(initialValue)
        const secondNumber = ref(0)
        const result = ref<number | null>(null)

        function calculate(): void {
          result.value = firstNumber.value + secondNumber.value
        }

        return () =>
          h('section', { class: 'calculator-widget' }, [
            h('h2', 'Calculadora'),

            h('label', { for: 'first-number' }, 'Primer número'),
            h('input', {
              id: 'first-number',
              type: 'number',
              value: firstNumber.value,
              onInput: (event: Event) => {
                firstNumber.value = Number((event.target as HTMLInputElement).value)
              },
            }),

            h('label', { for: 'second-number' }, 'Segundo número'),
            h('input', {
              id: 'second-number',
              type: 'number',
              value: secondNumber.value,
              onInput: (event: Event) => {
                secondNumber.value = Number((event.target as HTMLInputElement).value)
              },
            }),

            h('button', { type: 'button', onClick: calculate }, 'Sumar'),

            result.value !== null ? h('p', `Resultado: ${result.value}`) : null,
          ])
      },
    })

    app.mount(element)

    return {
      unmount() {
        app.unmount()
      },
    }
  },
}
