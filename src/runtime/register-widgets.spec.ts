import { beforeEach, describe, expect, it, vi } from 'vitest'

const { loadWidgetMock, loadWidgetManifestMock, registerWidgetsBatchMock } = vi.hoisted(() => ({
  loadWidgetMock: vi.fn(),
  loadWidgetManifestMock: vi.fn(),
  registerWidgetsBatchMock: vi.fn(),
}))

vi.mock('./widget-loader', () => ({
  loadWidget: loadWidgetMock,
}))

vi.mock('./load-widget-manifest', () => ({
  loadWidgetManifest: loadWidgetManifestMock,
}))

vi.mock('./widget-registry', () => ({
  registerWidgetsBatch: registerWidgetsBatchMock,
}))

import { registerWidgets } from './register-widgets'

describe('registerWidgets', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    loadWidgetManifestMock.mockResolvedValue({
      version: '1.0.0',
      widgets: [
        {
          name: 'calculator',
          description: 'Calculadora de suma',
          entry: '/widgets/calculator.js',
        },
      ],
    })
  })

  it('loads all widgets before registering them', async () => {
    const calculatorModule = { mount: vi.fn() }

    loadWidgetMock.mockResolvedValue(calculatorModule)

    await registerWidgets()

    expect(loadWidgetManifestMock).toHaveBeenCalledTimes(1)
    expect(loadWidgetMock).toHaveBeenCalledTimes(1)
    expect(loadWidgetMock).toHaveBeenCalledWith({
      name: 'calculator',
      description: 'Calculadora de suma',
      entry: '/widgets/calculator.js',
    })

    expect(registerWidgetsBatchMock).toHaveBeenCalledTimes(1)
    expect(registerWidgetsBatchMock).toHaveBeenCalledWith([
      {
        name: 'calculator',
        description: 'Calculadora de suma',
        module: calculatorModule,
      },
    ])
  })

  it('does not register widgets if loading fails', async () => {
    loadWidgetMock.mockRejectedValue(new Error('Loading failed'))

    await expect(registerWidgets()).rejects.toThrow('Loading failed')

    expect(registerWidgetsBatchMock).not.toHaveBeenCalled()
  })

  it('does not load widgets if loading the manifest fails', async () => {
    loadWidgetManifestMock.mockRejectedValue(new Error('Manifest loading failed'))

    await expect(registerWidgets()).rejects.toThrow('Manifest loading failed')

    expect(loadWidgetMock).not.toHaveBeenCalled()
    expect(registerWidgetsBatchMock).not.toHaveBeenCalled()
  })

  it('loads the manifest from a custom URL', async () => {
    loadWidgetMock.mockResolvedValue({ mount: vi.fn() })

    await registerWidgets('https://example.com/widgets/manifest.json')

    expect(loadWidgetManifestMock).toHaveBeenCalledWith('https://example.com/widgets/manifest.json')
  })

  it('uses the default manifest URL when no URL is provided', async () => {
    loadWidgetMock.mockResolvedValue({ mount: vi.fn() })

    await registerWidgets()

    expect(loadWidgetManifestMock).toHaveBeenCalledWith(undefined)
  })
})
