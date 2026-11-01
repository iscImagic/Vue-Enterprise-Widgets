import type { WidgetModule } from './widget-contract'

export interface WidgetDefinition {
  name: string
  description?: string
  module: WidgetModule
  styles?: string[]
}

const WidgetRegistry = new Map<string, WidgetDefinition>()

export function registerWidget(widget: WidgetDefinition): void {
  const name = widget.name.trim()

  if (!name) {
    throw new Error('Widget name cannot be empty.')
  }

  if (WidgetRegistry.has(name)) {
    throw new Error(`Widget with name "${name}" is already registered.`)
  }

  WidgetRegistry.set(name, {
    ...widget,
    name,
  })
}

export function getWidgetDefinition(name: string): WidgetDefinition | undefined {
  return WidgetRegistry.get(name)
}

export function getRegisteredWidgets(): WidgetDefinition[] {
  return [...WidgetRegistry.values()]
}

export function registerWidgetsBatch(widgets: WidgetDefinition[]): void {
  const names = new Set<string>()
  const normalizedWidgets: WidgetDefinition[] = []

  for (const widget of widgets) {
    const name = widget.name.trim()

    if (!name) {
      throw new Error('Widget name cannot be empty.')
    }

    if (names.has(name)) {
      throw new Error(`Widget with name "${name}" is duplicated in the batch.`)
    }

    if (WidgetRegistry.has(name)) {
      throw new Error(`Widget with name "${name}" is already registered.`)
    }

    names.add(name)
    normalizedWidgets.push({
      ...widget,
      name,
    })
  }

  for (const widget of normalizedWidgets) {
    WidgetRegistry.set(widget.name, widget)
  }
}

export function clearWidgetRegistry(): void {
  WidgetRegistry.clear()
}
