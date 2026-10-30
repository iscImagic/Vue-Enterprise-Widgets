import type { WidgetMountOptions } from './widget-contract'
import { getWidgetDefinition } from './widget-registry'

export interface MountedWidget {
  name: string
  unmount: () => void
}

const mountedWidgets = new Set<MountedWidget>()
const mountedElements = new WeakMap<HTMLElement, MountedWidget>()

export function mountWidget(
  name: string,
  element: HTMLElement,
  options?: WidgetMountOptions,
): () => void {
  if (mountedElements.has(element)) {
    throw new Error('An element cannot host more than one mounted widget.')
  }

  const definition = getWidgetDefinition(name)

  if (!definition) {
    throw new Error(`Widget "${name}" is not registered.`)
  }

  let instance: ReturnType<typeof definition.module.mount>

  try {
    instance = definition.module.mount(element, options)
  } catch (error) {
    element.replaceChildren()
    throw error
  }

  const mountedWidget: MountedWidget = {
    name,
    unmount: () => {
      try {
        instance.unmount()
      } finally {
        mountedWidgets.delete(mountedWidget)
        mountedElements.delete(element)
      }
    },
  }

  mountedWidgets.add(mountedWidget)
  mountedElements.set(element, mountedWidget)

  return mountedWidget.unmount
}

export function getMountedWidgets(): MountedWidget[] {
  return [...mountedWidgets]
}

export function unmountAllWidgets(): void {
  const errors: unknown[] = []

  for (const widget of mountedWidgets) {
    try {
      widget.unmount()
    } catch (error) {
      errors.push(error)
    }
  }

  if (errors.length > 0) {
    const error = new Error('One or more widgets failed to unmount.')

    Object.assign(error, { errors })
    throw error
  }
}
