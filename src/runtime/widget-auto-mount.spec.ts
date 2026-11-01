import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { autoMountWidgets } from './widget-auto-mount'
import { clearWidgetRegistry, registerWidget } from './widget-registry'
import type { WidgetInstance, WidgetModule } from './widget-contract'

function createWidget(): WidgetModule {
  return {
    mount: vi.fn<WidgetModule['mount']>(() => ({
      unmount: vi.fn<WidgetInstance['unmount']>(),
    })),
  }
}

describe('autoMountWidgets', () => {
  beforeEach(() => {
    clearWidgetRegistry()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('mounts every element with data-widget', async () => {
    const module = createWidget()

    registerWidget({
      name: 'calculator',
      module,
    })

    document.body.innerHTML = `
      <div data-widget="calculator" data-initial-value="10"></div>
      <div data-widget="calculator" data-initial-value="100"></div>
    `

    const cleanups = await autoMountWidgets()

    expect(module.mount).toHaveBeenCalledTimes(2)
    expect(cleanups).toHaveLength(2)

    expect(module.mount).toHaveBeenNthCalledWith(1, expect.any(HTMLElement), {
      config: { initialValue: 10 },
    })

    expect(module.mount).toHaveBeenNthCalledWith(2, expect.any(HTMLElement), {
      config: { initialValue: 100 },
    })
  })

  it('cleans up previously mounted widgets if a later mount fails', async () => {
    const unmount = vi.fn<WidgetInstance['unmount']>()

    const module: WidgetModule = {
      mount: vi
        .fn<WidgetModule['mount']>()
        .mockReturnValueOnce({ unmount })
        .mockImplementationOnce(() => {
          throw new Error('Mount failed')
        }),
    }

    registerWidget({
      name: 'calculator',
      module,
    })

    document.body.innerHTML = `
      <div data-widget="calculator"></div>
      <div data-widget="calculator"></div>
    `

    await expect(autoMountWidgets()).rejects.toThrow('Mount failed')

    expect(unmount).toHaveBeenCalledTimes(1)
  })

  it('ignores elements without a widget name', async () => {
    document.body.innerHTML = '<div data-widget=""></div>'

    await expect(autoMountWidgets()).resolves.toEqual([])
  })

  it('uses JSON configuration from data-widget-config', async () => {
    const module = createWidget()

    registerWidget({
      name: 'calculator',
      module,
    })

    document.body.innerHTML = `
      <div
        data-widget="calculator"
        data-widget-config='{"initialValue":25,"theme":"dark"}'
      ></div>
    `

    await autoMountWidgets()

    expect(module.mount).toHaveBeenCalledWith(expect.any(HTMLElement), {
      config: {
        initialValue: 25,
        theme: 'dark',
      },
    })
  })

  it('throws when data-widget-config contains invalid JSON', async () => {
    document.body.innerHTML = `
      <div data-widget="calculator" data-widget-config="{invalid}"></div>
    `

    await expect(autoMountWidgets()).rejects.toThrow(
      'Invalid JSON in data-widget-config for widget "calculator".',
    )
  })

  it('throws when data-widget-config is not a JSON object', async () => {
    document.body.innerHTML = `
      <div data-widget="calculator" data-widget-config="[1,2,3]"></div>
    `

    await expect(autoMountWidgets()).rejects.toThrow(
      'The data-widget-config for widget "calculator" must be a JSON object.',
    )
  })
})
