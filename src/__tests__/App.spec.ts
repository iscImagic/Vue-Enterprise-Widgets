import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { registerWidgetsMock } = vi.hoisted(() => ({
  registerWidgetsMock: vi.fn(),
}))

vi.mock('../runtime/register-widgets', () => ({
  registerWidgets: registerWidgetsMock,
}))

import App from '../App.vue'

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    registerWidgetsMock.mockResolvedValue(undefined)
  })

  it('renders the widget platform and calculator containers', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('CMS Widget Platform')
    expect(wrapper.text()).toContain('Calculadora 1')
    expect(wrapper.text()).toContain('Calculadora 2')
    expect(registerWidgetsMock).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})
