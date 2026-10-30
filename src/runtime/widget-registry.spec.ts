import { beforeEach, describe, expect, it } from 'vitest'
import {
  getRegisteredWidgets,
  getWidgetDefinition,
  registerWidget,
  registerWidgetsBatch,
  clearWidgetRegistry,
} from './widget-registry'
import type { WidgetModule } from './widget-contract'

describe('widget registry', () => {
  const mockWidgetModule: WidgetModule = {
    mount() {
      return {
        unmount() {},
      }
    },
  }
  beforeEach(() => {
    clearWidgetRegistry()
  })
  it('registers and retrieves a widget', () => {
    registerWidget({
      name: 'test-calculator',
      description: 'Test calculator',
      module: mockWidgetModule,
    })

    expect(getWidgetDefinition('test-calculator')).toEqual({
      name: 'test-calculator',
      description: 'Test calculator',
      module: mockWidgetModule,
    })
  })

  it('returns undefined for an unknown widget', () => {
    expect(getWidgetDefinition('unknown-widget')).toBeUndefined()
  })

  it('rejects duplicate widget names', () => {
    registerWidget({ name: 'test-duplicate', module: mockWidgetModule })

    expect(() => {
      registerWidget({ name: 'test-duplicate', module: mockWidgetModule })
    }).toThrow('Widget with name "test-duplicate" is already registered.')
  })

  it('lists registered widgets', () => {
    registerWidget({ name: 'test-list-widget', module: mockWidgetModule })

    expect(getRegisteredWidgets().some((widget) => widget.name === 'test-list-widget')).toBe(true)
  })

  it('registers a batch of widgets', () => {
    registerWidgetsBatch([
      {
        name: 'calculator',
        description: 'Calculadora de suma',
        module: mockWidgetModule,
      },
      {
        name: 'contact',
        description: 'Formulario de contacto',
        module: mockWidgetModule,
      },
    ])

    expect(getRegisteredWidgets().map((widget) => widget.name)).toEqual(['calculator', 'contact'])
  })

  it('does not register any widget when a batch contains a duplicate', () => {
    const initialWidgets = getRegisteredWidgets()

    expect(() =>
      registerWidgetsBatch([
        {
          name: 'calculator',
          module: mockWidgetModule,
        },
        {
          name: 'calculator',
          module: mockWidgetModule,
        },
      ]),
    ).toThrow('Widget with name "calculator" is duplicated in the batch.')

    expect(getRegisteredWidgets()).toEqual(initialWidgets)
  })

  it('does not register a batch if a widget name already exists', () => {
    registerWidget({
      name: 'calculator',
      module: mockWidgetModule,
    })

    expect(() =>
      registerWidgetsBatch([
        {
          name: 'contact',
          module: mockWidgetModule,
        },
        {
          name: 'calculator',
          module: mockWidgetModule,
        },
      ]),
    ).toThrow('Widget with name "calculator" is already registered.')

    expect(getRegisteredWidgets().map((widget) => widget.name)).toEqual(['calculator'])
  })

  it('rejects widget names that contain only whitespace', () => {
    expect(() => {
      registerWidget({
        name: '   ',
        module: mockWidgetModule,
      })
    }).toThrow()
  })

  it('rejects empty names in a batch without registering any widget', () => {
    expect(() => {
      registerWidgetsBatch([
        {
          name: 'valid-widget',
          module: mockWidgetModule,
        },
        {
          name: '   ',
          module: mockWidgetModule,
        },
      ])
    }).toThrow('Widget name cannot be empty.')

    expect(getRegisteredWidgets()).toEqual([])
  })

  it('rejects widget names with surrounding whitespace', () => {
    registerWidget({
      name: 'calculator',
      module: mockWidgetModule,
    })

    expect(() => {
      registerWidget({
        name: ' calculator ',
        module: mockWidgetModule,
      })
    }).toThrow()
  })

  it('rejects duplicate names with surrounding whitespace in a batch', () => {
    expect(() => {
      registerWidgetsBatch([
        {
          name: 'calculator',
          module: mockWidgetModule,
        },
        {
          name: ' calculator ',
          module: mockWidgetModule,
        },
      ])
    }).toThrow('Widget with name "calculator" is duplicated in the batch.')

    expect(getRegisteredWidgets()).toEqual([])
  })
})
