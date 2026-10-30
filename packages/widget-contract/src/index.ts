/**
 * Public configuration contract for CMS widgets.
 */
export interface WidgetMountOptions {
  props?: Record<string, unknown>
  config?: Record<string, unknown>
}

/**
 * Lifecycle handle returned by a mounted widget.
 */
export interface WidgetInstance {
  unmount(): void
}

/**
 * Public interface required by every compatible widget bundle.
 */
export interface WidgetModule {
  mount(element: HTMLElement, options?: WidgetMountOptions): WidgetInstance
}
