// Este primer borrador usa vi.resetModules() para aislar los registros entre pruebas. Sin embargo, los imports estáticos y dinámicos mezclados pueden hacer que el registro importado no sea la misma instancia del módulo en todas las pruebas.
// Para evitar esa complejidad innecesaria, te recomiendo usar una versión más sencilla y robusta: agrega una función para limpiar el registro solo para pruebas, o, mejor aún, registra nombres únicos y no reinicies los módulos. Para mantener este paso simple, elimina beforeEach y vi.resetModules() y utiliza nombres únicos en cada prueba.
// Además, elimina los imports dinámicos (await import(...)) y usa los imports estáticos del inicio. Así el archivo será más fácil de mantener.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { WidgetInstance, WidgetModule } from './widget-contract'
import { getMountedWidgets, mountWidget } from './widget-runtime'

describe('widget runtime', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('mounts a registered widget', async () => {
    const mount = vi.fn<WidgetModule['mount']>(() => ({
      unmount: vi.fn<WidgetInstance['unmount']>(),
    }))

    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget } = await import('./widget-runtime')

    const module: WidgetModule = { mount }

    register({
      name: 'runtime-test-widget',
      module,
    })

    const element = document.createElement('div')

    mountRuntimeWidget('runtime-test-widget', element)

    expect(mount).toHaveBeenCalledWith(element, undefined)
  })

  it('throws when the widget is not registered', () => {
    const element = document.createElement('div')

    expect(() => mountWidget('missing-widget', element)).toThrow(
      'Widget "missing-widget" is not registered.',
    )
  })

  it('unmounts a mounted widget when cleanup is called', async () => {
    const unmount = vi.fn<WidgetInstance['unmount']>()
    const mount = vi.fn<WidgetModule['mount']>(() => ({ unmount }))

    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget } = await import('./widget-runtime')

    register({
      name: 'runtime-cleanup-widget',
      module: { mount },
    })

    const element = document.createElement('div')
    const cleanup = mountRuntimeWidget('runtime-cleanup-widget', element)

    cleanup()

    expect(unmount).toHaveBeenCalledOnce()
  })

  it('removes a widget from the registry when it is unmounted', async () => {
    const unmount = vi.fn<WidgetInstance['unmount']>()
    const mount = vi.fn<WidgetModule['mount']>(() => ({ unmount }))

    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget, getMountedWidgets: getMounted } =
      await import('./widget-runtime')

    register({
      name: 'runtime-removal-widget',
      module: { mount },
    })

    const cleanup = mountRuntimeWidget('runtime-removal-widget', document.createElement('div'))

    expect(getMounted().some((widget) => widget.name === 'runtime-removal-widget')).toBe(true)

    cleanup()

    expect(getMounted().some((widget) => widget.name === 'runtime-removal-widget')).toBe(false)
    expect(unmount).toHaveBeenCalledOnce()
  })

  it('unmounts all currently mounted widgets', async () => {
    const unmountFirst = vi.fn<WidgetInstance['unmount']>()
    const unmountSecond = vi.fn<WidgetInstance['unmount']>()

    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget, unmountAllWidgets: unmountAll } =
      await import('./widget-runtime')

    register({
      name: 'runtime-cleanup-first',
      module: { mount: () => ({ unmount: unmountFirst }) },
    })

    register({
      name: 'runtime-cleanup-second',
      module: { mount: () => ({ unmount: unmountSecond }) },
    })

    mountRuntimeWidget('runtime-cleanup-first', document.createElement('div'))
    mountRuntimeWidget('runtime-cleanup-second', document.createElement('div'))

    unmountAll()

    expect(unmountFirst).toHaveBeenCalledOnce()
    expect(unmountSecond).toHaveBeenCalledOnce()
    expect(
      getMountedWidgets().some(
        (widget) =>
          widget.name === 'runtime-cleanup-first' || widget.name === 'runtime-cleanup-second',
      ),
    ).toBe(false)
  })

  it('rejects mounting a second widget on the same element', async () => {
    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget } = await import('./widget-runtime')

    register({
      name: 'runtime-duplicate-element',
      module: {
        mount: () => ({ unmount: vi.fn<WidgetInstance['unmount']>() }),
      },
    })

    const element = document.createElement('div')

    const cleanup = mountRuntimeWidget('runtime-duplicate-element', element)

    expect(() => mountRuntimeWidget('runtime-duplicate-element', element)).toThrow(
      'An element cannot host more than one mounted widget.',
    )

    cleanup()
  })

  it('cleans the element and propagates the error when mounting fails', async () => {
    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget, getMountedWidgets: getMounted } =
      await import('./widget-runtime')

    register({
      name: 'runtime-failing-widget',
      module: {
        mount: (element) => {
          element.append(document.createElement('span'))
          throw new Error('Mount failed')
        },
      },
    })

    const element = document.createElement('div')
    element.append(document.createElement('p'))

    expect(() => mountRuntimeWidget('runtime-failing-widget', element)).toThrow('Mount failed')

    expect(element.childElementCount).toBe(0)
    expect(getMounted().some((widget) => widget.name === 'runtime-failing-widget')).toBe(false)
  })

  it('removes the instance from the registry when unmount fails', async () => {
    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget, getMountedWidgets: getMounted } =
      await import('./widget-runtime')

    register({
      name: 'runtime-failing-unmount',
      module: {
        mount: () => ({
          unmount() {
            throw new Error('Unmount failed')
          },
        }),
      },
    })

    const element = document.createElement('div')
    const cleanup = mountRuntimeWidget('runtime-failing-unmount', element)

    expect(() => cleanup()).toThrow('Unmount failed')

    expect(getMounted().some((widget) => widget.name === 'runtime-failing-unmount')).toBe(false)

    // El mismo elemento debe poder reutilizarse.
    const secondCleanup = mountRuntimeWidget('runtime-failing-unmount', element)

    // Evitamos que el segundo desmontaje fallido afecte esta prueba.
    expect(getMounted()).toHaveLength(1)
    expect(() => secondCleanup()).toThrow('Unmount failed')
  })

  it('continues unmounting other widgets when one fails', async () => {
    const { registerWidget: register } = await import('./widget-registry')
    const {
      mountWidget: mountRuntimeWidget,
      getMountedWidgets: getMounted,
      unmountAllWidgets: unmountAll,
    } = await import('./widget-runtime')

    const failingUnmount = vi.fn<WidgetInstance['unmount']>(() => {
      throw new Error('First widget failed')
    })
    const successfulUnmount = vi.fn<WidgetInstance['unmount']>()

    register({
      name: 'runtime-bulk-failing',
      module: {
        mount: () => ({ unmount: failingUnmount }),
      },
    })

    register({
      name: 'runtime-bulk-successful',
      module: {
        mount: () => ({ unmount: successfulUnmount }),
      },
    })

    mountRuntimeWidget('runtime-bulk-failing', document.createElement('div'))
    mountRuntimeWidget('runtime-bulk-successful', document.createElement('div'))

    expect(() => unmountAll()).toThrow('One or more widgets failed to unmount.')

    expect(failingUnmount).toHaveBeenCalledOnce()
    expect(successfulUnmount).toHaveBeenCalledOnce()

    expect(
      getMounted().some(
        (widget) =>
          widget.name === 'runtime-bulk-failing' || widget.name === 'runtime-bulk-successful',
      ),
    ).toBe(false)
  })

  it('allows mounting a widget on the same element after a mount failure', async () => {
    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget, getMountedWidgets: getMounted } =
      await import('./widget-runtime')

    register({
      name: 'runtime-retry-widget',
      module: {
        mount: (element) => {
          element.append(document.createElement('span'))
          throw new Error('First mount failed')
        },
      },
    })

    const element = document.createElement('div')

    expect(() => mountRuntimeWidget('runtime-retry-widget', element)).toThrow('First mount failed')

    register({
      name: 'runtime-retry-success-widget',
      module: {
        mount: (element) => {
          element.append(document.createElement('span'))
          return { unmount: vi.fn<WidgetInstance['unmount']>() }
        },
      },
    })

    const cleanup = mountRuntimeWidget('runtime-retry-success-widget', element)

    expect(element.childElementCount).toBe(1)
    expect(getMounted().some((widget) => widget.name === 'runtime-retry-success-widget')).toBe(true)

    cleanup()
  })

  it('cleans up the widget when cleanup is called', async () => {
    const element = document.createElement('div')
    const unmount = vi.fn<WidgetInstance['unmount']>(() => {
      element.replaceChildren()
    })

    const { registerWidget: register } = await import('./widget-registry')
    const { mountWidget: mountRuntimeWidget } = await import('./widget-runtime')

    register({
      name: 'runtime-dom-cleanup-widget',
      module: {
        mount: (host) => {
          host.append(document.createElement('span'))
          return { unmount }
        },
      },
    })

    const cleanup = mountRuntimeWidget('runtime-dom-cleanup-widget', element)

    expect(element.childElementCount).toBe(1)

    cleanup()

    expect(unmount).toHaveBeenCalledOnce()
    expect(element.childElementCount).toBe(0)
  })
})
