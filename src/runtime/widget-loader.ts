import type { WidgetModule } from './widget-contract'
import type { WidgetManifestEntry } from './widget-manifest'

export function getWidgetModule(loadedModule: unknown, widgetName: string): WidgetModule {
  if (
    typeof loadedModule !== 'object' ||
    loadedModule === null ||
    !('widgetModule' in loadedModule)
  ) {
    throw new Error(`Widget bundle "${widgetName}" must export "widgetModule".`)
  }

  const widgetModule = loadedModule.widgetModule

  if (
    typeof widgetModule !== 'object' ||
    widgetModule === null ||
    !('mount' in widgetModule) ||
    typeof widgetModule.mount !== 'function'
  ) {
    throw new Error(`Widget bundle "${widgetName}" has an invalid widget module.`)
  }

  return widgetModule as WidgetModule
}

export async function loadWidget(entry: WidgetManifestEntry): Promise<WidgetModule> {
  const moduleUrl = new URL(entry.entry, window.location.href).href
  const loadedModule: unknown = await import(/* @vite-ignore */ moduleUrl)

  return getWidgetModule(loadedModule, entry.name)
}
