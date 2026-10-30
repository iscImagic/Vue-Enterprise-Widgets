import { describe, expect, it } from 'vitest'
import { getWidgetModule } from './widget-loader'
import type { WidgetModule } from './widget-contract'

describe('widget-loader', () => {
  const validWidget: WidgetModule = {
    mount: () => ({
      unmount: () => {},
    }),
  }

  it('returns a valid widget module', () => {
    expect(getWidgetModule({ widgetModule: validWidget }, 'test-widget')).toBe(validWidget)
  })

  it('throws when the bundle does not export widgetModule', () => {
    expect(() => getWidgetModule({}, 'test-widget')).toThrow(
      'Widget bundle "test-widget" must export "widgetModule".',
    )
  })

  it('throws when the widget module has no mount function', () => {
    expect(() => getWidgetModule({ widgetModule: {} }, 'test-widget')).toThrow(
      'Widget bundle "test-widget" has an invalid widget module.',
    )
  })

  it('throws when the loaded module is null', () => {
    expect(() => getWidgetModule(null, 'test-widget')).toThrow(
      'Widget bundle "test-widget" must export "widgetModule".',
    )
  })
})
