import type { WidgetManifest } from './widget-manifest'

export function validateWidgetManifest(manifest: WidgetManifest): void {
  if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest)) {
    throw new Error('Widget manifest must be an object.')
  }

  if (typeof manifest.version !== 'string' || !manifest.version.trim()) {
    throw new Error('Widget manifest version cannot be empty.')
  }

  if (!Array.isArray(manifest.widgets)) {
    throw new Error('Widget manifest widgets must be an array.')
  }

  const registeredNames = new Set<string>()

  for (const widget of manifest.widgets) {
    if (typeof widget !== 'object' || widget === null || Array.isArray(widget)) {
      throw new Error('Each widget manifest entry must be an object.')
    }

    if (typeof widget.name !== 'string' || !widget.name.trim()) {
      throw new Error('Widget name cannot be empty.')
    }

    if (typeof widget.entry !== 'string' || !widget.entry.trim()) {
      throw new Error(`Widget "${widget.name}" must define an entry.`)
    }

    if (widget.description !== undefined && typeof widget.description !== 'string') {
      throw new Error(`Widget "${widget.name}" description must be a string.`)
    }

    if (widget.styles !== undefined) {
      if (
        !Array.isArray(widget.styles) ||
        !widget.styles.every((style) => typeof style === 'string' && style.trim().length > 0)
      ) {
        throw new Error(`Widget "${widget.name}" styles must be an array of non-empty strings.`)
      }
    }

    if (registeredNames.has(widget.name)) {
      throw new Error(`Duplicate widget name "${widget.name}" in manifest.`)
    }

    registeredNames.add(widget.name)
  }
}
