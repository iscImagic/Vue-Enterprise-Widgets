# CMS Widget Platform

A framework-agnostic widget integration platform built with **TypeScript, Vite, and a shared public contract**. It enables independently developed frontend widgets to be registered, loaded, mounted, and unmounted through a common runtime.

The project currently demonstrates integration between **Vue 3 and React** widgets on the same page, without requiring framework-specific changes to the central runtime.

## Overview

CMS Widget Platform explores an architecture for distributing reusable frontend widgets to content management systems such as Sitefinity and WordPress.

The platform separates widget development from widget integration. Independent teams can build their widgets in separate projects, produce JavaScript bundles, and register them through a shared manifest.

The runtime relies on a small public contract instead of depending directly on each widget's framework.

## Problem

When widgets are developed independently, each one may introduce its own build configuration, dependencies, integration logic, and release process.

As the number of widgets grows, this can lead to:

- Duplicated configuration and integration code.
- Inconsistent widget interfaces.
- More complex deployment processes.
- Increased maintenance overhead.
- Framework dependencies leaking into the central application.
- Greater risk of regressions when introducing new widgets.

## Proposed Solution

The platform provides a shared runtime and a public widget contract that define how widgets integrate with their host environment.

The architecture separates three responsibilities:

1. **Widget development:** teams implement widgets using their preferred frontend framework.
2. **Widget distribution:** each team produces a JavaScript bundle that exposes the required public interface.
3. **Widget integration:** the central runtime discovers widgets through a manifest and manages their lifecycle.

### Main goals

- Support independently developed widgets.
- Define a framework-agnostic integration contract.
- Load widgets dynamically through a manifest.
- Centralize widget registration and lifecycle management.
- Support configuration through HTML attributes and JSON.
- Validate widget registrations and handle mounting failures.
- Provide automated tests for runtime behavior.
- Establish a foundation for independent versioning and automated releases.

## Architecture

```text
                 CMS / Host Page
                        |
                        v
                Widget Manifest
                        |
                        v
                 Shared Runtime
                        |
              +---------+---------+
              |         |         |
              v         v         v
          Vue Widget  React     Other
                      Widget   Frameworks
              |         |         |
              +---------+---------+
                        |
                 Public Contract
```

The public contract defines how a widget is mounted and how its resources are released. The runtime does not need to know the framework used internally by a widget.

Each widget is registered by name and loaded from its configured JavaScript entry.

## Public Widget Contract

The shared contract is provided by the package:

`@cms-widget-platform/widget-contract`

Every compatible widget bundle must expose a named export called `widgetModule`.

The contract defines three interfaces:

- `WidgetMountOptions`: optional properties and widget-specific configuration.
- `WidgetInstance`: lifecycle handle returned by the widget.
- `WidgetModule`: interface implemented by every compatible widget.

Conceptually, a widget implements the following interface:

```typescript
export interface WidgetMountOptions {
  props?: Record<string, unknown>
  config?: Record<string, unknown>
}

export interface WidgetInstance {
  unmount(): void
}

export interface WidgetModule {
  mount(element: HTMLElement, options?: WidgetMountOptions): WidgetInstance
}
```

### Lifecycle

**Mount**

The runtime provides an HTML element and optional configuration. The widget initializes its framework application inside that element.

**Unmount**

The widget releases its framework resources and removes the content it owns. The runtime removes the widget from its mounted-widget registry, including when the widget's `unmount()` method throws.

Widgets should not remove content owned by the host page or other widgets.

## Framework Support

### Vue 3

The Vue example demonstrates a widget developed in a separate Vite project.

The widget uses Vue's `createApp()` to mount its component and `app.unmount()` to release it.

### React

The React example demonstrates the same contract using React's `createRoot()` and `root.unmount()`.

React and React DOM are included in the example's generated bundle so the central runtime does not need to provide React through an import map.

### Framework independence

Both examples expose the same `widgetModule` interface. The central runtime loads them without framework-specific integration code.

This demonstrates compatibility between Vue and React; it does not imply that every framework or third-party library has already been tested.

## Manifest Configuration

Widgets are registered through `public/widgets/manifest.json`.

Example:

```json
{
  "version": "1.0.0",
  "widgets": [
    {
      "name": "calculator",
      "description": "Calculator widget",
      "entry": "/widgets/calculator.js"
    },
    {
      "name": "external-contact-widget",
      "description": "External Vue contact form",
      "entry": "/widgets/external-contact-widget.js"
    },
    {
      "name": "external-react-widget",
      "description": "External React contact form",
      "entry": "/widgets/external-react-widget.js"
    }
  ]
}
```

Each entry identifies a widget by its name and specifies the URL of its JavaScript bundle.

The manifest is the integration point between independently built widgets and the central runtime.

## Automatic Mounting and Configuration

The runtime can discover HTML elements marked with `data-widget`.

Example:

```html
<div data-widget="calculator" data-initial-value="10"></div>

<div data-widget="external-react-widget" data-widget-config='{"theme":"dark"}'></div>
```

The widget name must match an entry in the manifest and the runtime's registered widget definitions.

Configuration can be supplied through `data-initial-value` or as a JSON object in `data-widget-config`.

Invalid JSON and non-object JSON configurations are rejected.

## Error Handling and Lifecycle Management

The runtime includes safeguards for common integration failures:

- Rejects attempts to mount multiple widgets on the same element.
- Rejects mounting when a widget is not registered.
- Cleans up the element when mounting fails.
- Removes widget registrations from the mounted-widget tracking structures during cleanup.
- Continues attempting to unmount other widgets when one widget fails.
- Allows an element to be reused after a mounting failure or cleanup.
- Includes unit tests for registration, mounting, configuration, and lifecycle behavior.

The current implementation supports explicit cleanup through the returned cleanup function and `unmountAllWidgets()`.

**Automatic detection of DOM elements removed by the host page is not yet implemented.** Integrations that dynamically remove widget containers must currently manage cleanup explicitly.

## Project Structure

The central project contains the runtime, contract, widget implementations, tests, and public distribution files.

```text
Vue-Enterprise-Widgets/
├── packages/
│   └── widget-contract/
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── public/
│   └── widgets/
│       ├── manifest.json
│       ├── calculator.js
│       ├── contact-form.js
│       ├── external-contact-widget.js
│       └── external-react-widget.js
├── src/
│   ├── runtime/
│   └── widgets/
├── widget-demo.html
├── vite.config.ts
└── package.json
```

The Vue and React external examples are developed in separate projects. Their generated bundles are copied into the central project's `public/widgets/` directory for the current integration demonstration.

The exact project structure may evolve as distribution and deployment workflows are improved.

## Technology Stack

### Core

- TypeScript
- Vite
- JavaScript
- Vue 3
- React

### Testing and Code Quality

- Vitest
- ESLint
- Prettier
- Husky
- lint-staged

### Future Evaluation

- Playwright for end-to-end testing
- Google Tag Manager integration
- CI/CD and automated distribution
- Independent widget versioning

## Development and Validation

Run the following commands from the central project root:

```bash
npm run type-check
npm run test:unit -- --run
npm run build
npm run build:widget
```

These commands validate TypeScript, execute the unit tests, build the central application, and generate the configured widget bundles.

Each external widget project must also be built independently.

### External Widget Integration Workflow

1. Create a separate project using the desired frontend framework.
2. Install `@cms-widget-platform/widget-contract`.
3. Implement and export `widgetModule`.
4. Configure Vite to generate an ES module bundle.
5. Ensure framework dependencies are available to the bundle or host environment.
6. Copy the generated JavaScript bundle into `public/widgets/` for the current local demonstration.
7. Add the widget entry to `manifest.json`.
8. Add a matching `data-widget` element to the demo page.
9. Verify mounting, interaction, and cleanup in the browser.

For the current local setup, the public contract package is built and packaged as a local `.tgz` archive before being installed into the external projects.

## Current Limitations

The following capabilities remain outside the current implementation:

- Separate CSS files declared and loaded through the manifest.
- Automatic cleanup when a host page removes a widget container.
- A complete independent publishing and versioning workflow for external bundles.
- Automated deployment and distribution.
- Production CMS integration validation.
- Comprehensive end-to-end and performance testing.

Widget styles are not yet managed by a dedicated manifest field. The current examples demonstrate functional integration, not complete CSS isolation from host-page styles.

## Roadmap

- [x] Define the public widget contract.
- [x] Implement dynamic widget loading through a manifest.
- [x] Implement runtime registration and lifecycle management.
- [x] Build and integrate an external Vue widget.
- [x] Build and integrate an external React widget.
- [x] Add unit tests for runtime behavior and failure handling.
- [ ] Add manifest-based CSS loading and deduplication.
- [ ] Implement automatic cleanup for removed DOM containers.
- [ ] Improve external bundle publishing and versioning.
- [ ] Add end-to-end integration tests.
- [ ] Evaluate CI/CD and automated deployments.
- [ ] Validate integration with a real CMS environment.

## Status

**Work in progress — core cross-framework integration demonstrated.**

The current proof of concept successfully runs Vue and React widgets on the same page through a shared public contract and manifest, without requiring framework-specific changes to the central runtime.

The next iterations will focus on styling, lifecycle automation, distribution, and production readiness.
