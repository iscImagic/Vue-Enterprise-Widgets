export interface WidgetManifestEntry {
  name: string
  description?: string
  entry: string
  styles?: string[]
}

export interface WidgetManifest {
  version: string
  widgets: WidgetManifestEntry[]
}
