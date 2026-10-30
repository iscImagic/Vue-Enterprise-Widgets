import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadWidgetManifest } from './load-widget-manifest'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadWidgetManifest', () => {
  it('loads and validates a widget manifest', async () => {
    const manifest = {
      version: '1.0.0',
      widgets: [
        {
          name: 'calculator',
          description: 'Calculadora de suma',
          entry: '/widgets/calculator.js',
        },
      ],
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(manifest),
      }),
    )

    await expect(loadWidgetManifest()).resolves.toEqual(manifest)
    expect(fetch).toHaveBeenCalledWith('/widgets/manifest.json')
  })

  it('loads the manifest from a custom URL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          version: '1.0.0',
          widgets: [],
        }),
      }),
    )

    await loadWidgetManifest('/custom/manifest.json')

    expect(fetch).toHaveBeenCalledWith('/custom/manifest.json')
  })

  it('throws when the HTTP response is unsuccessful', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      }),
    )

    await expect(loadWidgetManifest()).rejects.toThrow(
      'Failed to load widget manifest: 404 Not Found',
    )
  })

  it('rejects an invalid manifest', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          version: '',
          widgets: [],
        }),
      }),
    )

    await expect(loadWidgetManifest()).rejects.toThrow('Widget manifest version cannot be empty.')
  })

  it('rejects a manifest with an empty version', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          version: ' ',
          widgets: [],
        }),
      }),
    )

    await expect(loadWidgetManifest()).rejects.toThrow('Widget manifest version cannot be empty.')
  })
})
