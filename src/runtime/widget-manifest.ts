export interface WidgetManifestEntry {
  name: string
  description?: string
  entry: string
}

export interface WidgetManifest {
  version: string
  widgets: WidgetManifestEntry[]
}
