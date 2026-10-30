import type { WidgetManifest } from './widget-manifest'
import { validateWidgetManifest } from './validate-widget-manifest'

export async function loadWidgetManifest(url = '/widgets/manifest.json'): Promise<WidgetManifest> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load widget manifest: ${response.status} ${response.statusText}`)
  }

  const manifest: unknown = await response.json()

  validateWidgetManifest(manifest as WidgetManifest)

  return manifest as WidgetManifest
}
