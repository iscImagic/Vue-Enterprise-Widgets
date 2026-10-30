import { createApp as e, h as t, ref as n } from 'vue'
//#region src/widgets/calculator/index.ts
var r = {
  mount(r, i) {
    let a = Number(i?.config?.initialValue ?? 0),
      o = e({
        setup() {
          let e = n(a),
            r = n(0),
            i = n(null)
          function o() {
            i.value = e.value + r.value
          }
          return () =>
            t('section', { class: 'calculator-widget' }, [
              t('h2', 'Calculadora'),
              t('label', { for: 'first-number' }, 'Primer número'),
              t('input', {
                id: 'first-number',
                type: 'number',
                value: e.value,
                onInput: (t) => {
                  e.value = Number(t.target.value)
                },
              }),
              t('label', { for: 'second-number' }, 'Segundo número'),
              t('input', {
                id: 'second-number',
                type: 'number',
                value: r.value,
                onInput: (e) => {
                  r.value = Number(e.target.value)
                },
              }),
              t(
                'button',
                {
                  type: 'button',
                  onClick: o,
                },
                'Sumar',
              ),
              i.value === null ? null : t('p', `Resultado: ${i.value}`),
            ])
        },
      })
    return (
      o.mount(r),
      {
        unmount() {
          o.unmount()
        },
      }
    )
  },
}
//#endregion
export { r as widgetModule }
