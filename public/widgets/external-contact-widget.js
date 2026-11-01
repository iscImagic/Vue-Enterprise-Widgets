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
// src/ExternalContactForm.vue?vue&type=script&setup=true&lang.ts
var d = { class: 'ew-contact' },
  f = {
    key: 0,
    class: 'ew-contact__success',
    role: 'status',
  },
  p = /*#__PURE__*/ ((e, t) => {
    let n = e.__vccOpts || e
    for (let [e, r] of t) n[e] = r
    return n
  })(
    /* @__PURE__ */ i({
      __name: 'ExternalContactForm',
      setup(e) {
        let i = o(''),
          p = o(''),
          m = o(''),
          h = o(!1)
        function g() {
          h.value = !0
        }
        return (e, o) => (
          a(),
          n('section', d, [
            (o[7] ||= r('h2', { class: 'ew-contact__title' }, 'Contact us', -1)),
            (o[8] ||= r(
              'p',
              { class: 'ew-contact__description' },
              ' External widget built by an independent team. ',
              -1,
            )),
            r(
              'form',
              {
                class: 'ew-contact__form',
                onSubmit: u(g, ['prevent']),
              },
              [
                (o[3] ||= r('label', { for: 'external-name' }, 'Name', -1)),
                l(
                  r(
                    'input',
                    {
                      id: 'external-name',
                      'onUpdate:modelValue': (o[0] ||= (e) => (i.value = e)),
                      class: 'ew-contact__input',
                      required: '',
                      placeholder: 'Your name',
                    },
                    null,
                    512,
                  ),
                  [[c, i.value]],
                ),
                (o[4] ||= r('label', { for: 'external-email' }, 'Email', -1)),
                l(
                  r(
                    'input',
                    {
                      id: 'external-email',
                      'onUpdate:modelValue': (o[1] ||= (e) => (p.value = e)),
                      class: 'ew-contact__input',
                      type: 'email',
                      required: '',
                      placeholder: 'you@example.com',
                    },
                    null,
                    512,
                  ),
                  [[c, p.value]],
                ),
                (o[5] ||= r('label', { for: 'external-message' }, 'Message', -1)),
                l(
                  r(
                    'textarea',
                    {
                      id: 'external-message',
                      'onUpdate:modelValue': (o[2] ||= (e) => (m.value = e)),
                      class: 'ew-contact__input ew-contact__textarea',
                      required: '',
                      placeholder: 'How can we help?',
                    },
                    null,
                    512,
                  ),
                  [[c, m.value]],
                ),
                (o[6] ||= r(
                  'button',
                  {
                    class: 'ew-contact__button',
                    type: 'submit',
                  },
                  ' Send message ',
                  -1,
                )),
              ],
              32,
            ),
            h.value
              ? (a(),
                n('p', f, ' Thank you, ' + s(i.value) + '! Your message has been received. ', 1))
              : t('', !0),
          ])
        )
      },
    }),
    [['__scopeId', 'data-v-d648d760']],
  ),
  m = {
    mount(t) {
      let n = e(p)
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
export { m as widgetModule }
