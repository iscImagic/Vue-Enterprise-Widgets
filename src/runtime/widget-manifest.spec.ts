import { describe, expect, it } from 'vitest'
import type { WidgetManifest } from './widget-manifest'

describe('widget-manifest', () => {
  it('defines the manifest structure for local widgets', () => {
    const manifest: WidgetManifest = {
      version: '1.0.0',
      widgets: [
        {
          name: 'calculator',
          description: 'Calculadora de suma',
          entry: '/widgets/calculator.js',
        },
      ],
    }

    expect(manifest.version).toBe('1.0.0')
    expect(manifest.widgets).toHaveLength(1)
    expect(manifest.widgets[0]?.name).toBe('calculator')
    expect(manifest.widgets[0]?.entry).toBe('/widgets/calculator.js')
  })
})
