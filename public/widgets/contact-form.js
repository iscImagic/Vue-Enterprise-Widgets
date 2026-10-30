import {
  createApp as e,
  createCommentVNode as t,
  createElementBlock as n,
  createElementVNode as r,
  defineComponent as i,
  openBlock as a,
  ref as o,
  toDisplayString as s,
  vModelText as c,
  withDirectives as l,
  withModifiers as u,
} from 'vue'
//#region src/widgets/contact-form/ContactForm.vue?vue&type=script&setup=true&lang.ts
var d = { class: 'contact-form__field' },
  f = { class: 'contact-form__field' },
  p = { class: 'contact-form__field' },
  m = {
    key: 0,
    class: 'contact-form__success',
    role: 'status',
  },
  h = /*#__PURE__*/ ((e, t) => {
    let n = e.__vccOpts || e
    for (let [e, r] of t) n[e] = r
    return n
  })(
    /* @__PURE__ */ i({
      __name: 'ContactForm',
      setup(e) {
        let i = o(''),
          h = o(''),
          g = o(''),
          _ = o(!1)
        function v() {
          _.value = !0
        }
        return (e, o) => (
          a(),
          n(
            'form',
            {
              class: 'contact-form',
              onSubmit: u(v, ['prevent']),
            },
            [
              (o[9] ||= r('h2', null, 'Formulario de contacto', -1)),
              r('div', d, [
                (o[6] ||= r('label', { for: 'contact-name' }, 'Nombre', -1)),
                l(
                  r(
                    'input',
                    {
                      id: 'contact-name',
                      'onUpdate:modelValue': (o[0] ||= (e) => (i.value = e)),
                      type: 'text',
                      placeholder: 'Escribe tu nombre',
                      required: '',
                      onInput: (o[1] ||= (e) => (_.value = !1)),
                    },
                    null,
                    544,
                  ),
                  [[c, i.value]],
                ),
              ]),
              r('div', f, [
                (o[7] ||= r('label', { for: 'contact-email' }, 'Correo electrónico', -1)),
                l(
                  r(
                    'input',
                    {
                      id: 'contact-email',
                      'onUpdate:modelValue': (o[2] ||= (e) => (h.value = e)),
                      type: 'email',
                      placeholder: 'correo@ejemplo.com',
                      required: '',
                      onInput: (o[3] ||= (e) => (_.value = !1)),
                    },
                    null,
                    544,
                  ),
                  [[c, h.value]],
                ),
              ]),
              r('div', p, [
                (o[8] ||= r('label', { for: 'contact-message' }, 'Mensaje', -1)),
                l(
                  r(
                    'textarea',
                    {
                      id: 'contact-message',
                      'onUpdate:modelValue': (o[4] ||= (e) => (g.value = e)),
                      placeholder: '¿En qué podemos ayudarte?',
                      rows: '4',
                      required: '',
                      onInput: (o[5] ||= (e) => (_.value = !1)),
                    },
                    null,
                    544,
                  ),
                  [[c, g.value]],
                ),
              ]),
              (o[10] ||= r(
                'button',
                {
                  type: 'submit',
                  class: 'contact-form__button',
                },
                'Enviar mensaje',
                -1,
              )),
              _.value
                ? (a(), n('p', m, ' Formulario validado. Gracias, ' + s(i.value) + '. ', 1))
                : t('', !0),
            ],
            32,
          )
        )
      },
    }),
    [['__scopeId', 'data-v-1c75b8f8']],
  ),
  g = {
    mount(t) {
      let n = e(h)
      return (
        n.mount(t),
        {
          unmount() {
            n.unmount()
          },
        }
      )
    },
  }
//#endregion
export { g as widgetModule }
