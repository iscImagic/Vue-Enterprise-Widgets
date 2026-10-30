import { describe, expect, it } from 'vitest'
import type { WidgetManifest } from './widget-manifest'
import { validateWidgetManifest } from './validate-widget-manifest'

describe('validateWidgetManifest', () => {
  it('accepts a valid manifest', () => {
    const manifest: WidgetManifest = {
      version: '1.0.0',
      widgets: [
        {
          name: 'calculator',
          entry: '/widgets/calculator.js',
        },
      ],
    }

    expect(() => validateWidgetManifest(manifest)).not.toThrow()
  })

  it('rejects an empty version', () => {
    const manifest: WidgetManifest = {
      version: ' ',
      widgets: [],
    }

    expect(() => validateWidgetManifest(manifest)).toThrow(
      'Widget manifest version cannot be empty.',
    )
  })

  it('rejects an empty widget name', () => {
    const manifest: WidgetManifest = {
      version: '1.0.0',
      widgets: [{ name: ' ', entry: '/widgets/calculator.js' }],
    }

    expect(() => validateWidgetManifest(manifest)).toThrow('Widget name cannot be empty.')
  })

  it('rejects an empty entry', () => {
    const manifest: WidgetManifest = {
      version: '1.0.0',
      widgets: [{ name: 'calculator', entry: ' ' }],
    }

    expect(() => validateWidgetManifest(manifest)).toThrow(
      'Widget "calculator" must define an entry.',
    )
  })

  it('rejects duplicate widget names', () => {
    const manifest: WidgetManifest = {
      version: '1.0.0',
      widgets: [
        { name: 'calculator', entry: '/widgets/calculator.js' },
        { name: 'calculator', entry: '/widgets/calculator-v2.js' },
      ],
    }

    expect(() => validateWidgetManifest(manifest)).toThrow(
      'Duplicate widget name "calculator" in manifest.',
    )
  })

  it('rejects a null manifest', () => {
    expect(() => validateWidgetManifest(null as never)).toThrow(
      'Widget manifest must be an object.',
    )
  })

  it('rejects a null widget entry', () => {
    expect(() =>
      validateWidgetManifest({
        version: '1.0.0',
        widgets: [null],
      } as never),
    ).toThrow('Each widget manifest entry must be an object.')
  })

  it('rejects a non-string widget name', () => {
    expect(() =>
      validateWidgetManifest({
        version: '1.0.0',
        widgets: [{ name: 123, entry: '/widgets/test.js' }],
      } as never),
    ).toThrow('Widget name cannot be empty.')
  })

  it('rejects a non-string entry', () => {
    expect(() =>
      validateWidgetManifest({
        version: '1.0.0',
        widgets: [{ name: 'calculator', entry: 123 }],
      } as never),
    ).toThrow('Widget "calculator" must define an entry.')
  })

  it('rejects a non-string description', () => {
    expect(() =>
      validateWidgetManifest({
        version: '1.0.0',
        widgets: [
          {
            name: 'calculator',
            entry: '/widgets/calculator.js',
            description: 123,
          },
        ],
      } as never),
    ).toThrow('Widget "calculator" description must be a string.')
  })
})
