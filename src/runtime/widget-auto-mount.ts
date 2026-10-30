import type { WidgetMountOptions } from './widget-contract'
import { mountWidget } from './widget-runtime'

function getWidgetOptions(element: HTMLElement): WidgetMountOptions {
  const rawConfig = element.dataset.widgetConfig

  if (rawConfig === undefined) {
    const initialValue = element.dataset.initialValue

    return {
      config: initialValue === undefined ? {} : { initialValue: Number(initialValue) },
    }
  }

  let config: unknown

  try {
    config = JSON.parse(rawConfig)
  } catch {
    throw new Error(
      `Invalid JSON in data-widget-config for widget "${element.dataset.widget ?? 'unknown'}".`,
    )
  }

  if (typeof config !== 'object' || config === null || Array.isArray(config)) {
    throw new Error(
      `The data-widget-config for widget "${element.dataset.widget ?? 'unknown'}" must be a JSON object.`,
    )
  }

  return { config: config as Record<string, unknown> }
}

export function autoMountWidgets(root: ParentNode = document): Array<() => void> {
  const elements = root.querySelectorAll<HTMLElement>('[data-widget]')
  const cleanups: Array<() => void> = []

  try {
    for (const element of elements) {
      const name = element.dataset.widget

      if (!name) continue

      const cleanup = mountWidget(name, element, getWidgetOptions(element))

      cleanups.push(cleanup)
    }

    return cleanups
  } catch (error) {
    for (const cleanup of cleanups.reverse()) {
      try {
        cleanup()
      } catch {
        // Preserve the original mounting error.
      }
    }

    throw error
  }
}
