import { loadWidgetManifest } from './load-widget-manifest'
import { registerWidgetsBatch } from './widget-registry'
import { loadWidget } from './widget-loader'
import type { WidgetManifest } from './widget-manifest'

export async function registerWidgets(manifestUrl?: string): Promise<void> {
  const manifest: WidgetManifest = await loadWidgetManifest(manifestUrl)
  const loadedWidgets = []

  for (const entry of manifest.widgets) {
    const module = await loadWidget(entry)

    loadedWidgets.push({
      name: entry.name,
      description: entry.description,
      module,
    })
  }

  registerWidgetsBatch(loadedWidgets)
}
