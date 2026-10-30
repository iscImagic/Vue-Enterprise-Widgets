/**
 * Public configuration contract for CMS widgets.
 *
 * `props` contains values intended to be passed as component properties.
 * `config` contains widget-specific configuration.
 */
export interface WidgetMountOptions {
  props?: Record<string, unknown>
  config?: Record<string, unknown>
}

/**
 * Lifecycle handle returned when a widget is mounted.
 */
export interface WidgetInstance {
  /**
   * Releases resources and removes the widget from its host element.
   * Must be safe to call according to the widget's documented lifecycle.
   */
  unmount(): void
}

/**
 * Public interface that every compatible widget bundle must implement.
 *
 * A bundle must export an object named `widgetModule` implementing this
 * interface. The runtime is responsible for calling mount and unmount.
 */
export interface WidgetModule {
  /**
   * Mounts the widget inside the supplied host element.
   *
   * @param element - DOM element that will contain the widget.
   * @param options - Optional properties and widget-specific configuration.
   * @returns A lifecycle handle used to unmount the widget.
   */
  mount(element: HTMLElement, options?: WidgetMountOptions): WidgetInstance
}
