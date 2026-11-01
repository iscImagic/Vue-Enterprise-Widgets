import type { WidgetMountOptions } from './widget-contract'
import { getWidgetDefinition } from './widget-registry'
import { loadWidgetStyles } from './load-widget-styles'

export interface MountedWidget {
  name: string
  unmount: () => void
}

const mountedWidgets = new Set<MountedWidget>()
const mountedElements = new WeakMap<HTMLElement, MountedWidget>()
const mountingElements = new WeakSet<HTMLElement>()

export async function mountWidget(
  name: string,
  element: HTMLElement,
  options?: WidgetMountOptions,
): Promise<() => void> {
  if (mountedElements.has(element) || mountingElements.has(element)) {
    throw new Error('An element cannot host more than one mounted widget.')
  }

  const definition = getWidgetDefinition(name)

  if (!definition) {
    throw new Error(`Widget "${name}" is not registered.`)
  }

  mountingElements.add(element)

  const shadowRoot = element.shadowRoot ?? element.attachShadow({ mode: 'open' })
  const container = document.createElement('div')

  try {
    shadowRoot.replaceChildren()

    await loadWidgetStyles(definition.styles ?? [], shadowRoot)

    shadowRoot.appendChild(container)

    const instance = definition.module.mount(container, options)

    const mountedWidget: MountedWidget = {
      name,
      unmount: () => {
        try {
          instance.unmount()
        } finally {
          shadowRoot.replaceChildren()
          mountedWidgets.delete(mountedWidget)
          mountedElements.delete(element)
        }
      },
    }

    mountedWidgets.add(mountedWidget)
    mountedElements.set(element, mountedWidget)

    return mountedWidget.unmount
  } catch (error) {
    shadowRoot.replaceChildren()
    throw error
  } finally {
    mountingElements.delete(element)
  }
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
