# CMS Widgets Micro Frontend

A Micro Frontend architecture built with **Vue 3** and **Vite** to optimize the development, build, and distribution of multiple widgets used within a CMS.

## Overview

This project explores an approach for managing multiple Vue.js widgets from a single frontend project and distributing them through an optimized bundle.

The main goal is to simplify the current widget generation and release process while improving maintainability, consistency, and developer experience.

## Problem

When multiple widgets are developed independently, each widget may require its own build configuration and release process.

As the number of widgets grows, this can introduce:

* Multiple build configurations
* Repeated dependencies and configuration
* More complex release processes
* Increased maintenance overhead
* Longer and more difficult deployments
* Greater risk of inconsistencies between widgets

## Proposed Solution

This project proposes a **Micro Frontend architecture** where multiple widgets can be developed and managed within a single project.

The application will generate an optimized distribution that allows the widgets to be consumed independently by the CMS while sharing a common development and build environment.

### Main goals

* Centralize widget development.
* Simplify the build process.
* Reduce duplicated configuration.
* Optimize the generated bundles.
* Keep widgets isolated and reusable.
* Establish a consistent development workflow.
* Introduce automated testing.
* Integrate analytics through Google Tag Manager.
* Establish a foundation for CI/CD and automated releases.

## Architecture

The initial architecture is based on:

```text
                    CMS
                     │
                     ▼
            ┌─────────────────┐
            │  Widget Bundle  │
            └─────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ Widget A│  │ Widget B│  │ Widget C│
   └─────────┘  └─────────┘  └─────────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
              Shared Runtime
```

The architecture may evolve as the project progresses and different integration strategies are evaluated.

## Tech Stack

### Core

* [Vue 3](https://vuejs.org/)
* [Vite](https://vite.dev/)
* TypeScript
* JavaScript

### Styling

* [Tailwind CSS](https://tailwindcss.com/)

### Testing

* Unit testing
* Component testing
* End-to-end testing

Potential tools:

* Vitest
* Vue Test Utils
* Playwright

### Analytics

* Google Tag Manager

### Code Quality

* ESLint
* Prettier
* Husky
* lint-staged

### Deployment

The project will evaluate an automated CI/CD workflow for building and distributing the widgets.

Potential deployment platforms:

* Vercel
* Netlify
* Azure DevOps

## Project Structure

The project will be organized to keep widgets isolated while allowing them to share common configuration, utilities, components, and dependencies.

```text
src/
├── widgets/
│   ├── widget-a/
│   ├── widget-b/
│   └── widget-c/
│
├── components/
├── composables/
├── services/
├── utils/
└── main.ts
```

The final structure may change as the architecture is validated.

## Build & Release

One of the main objectives is to improve the current release workflow.

Instead of treating every widget as a completely independent project, the build process will be responsible for generating the required distribution artifacts from a centralized codebase.

The project will investigate:

* Bundle optimization
* Code splitting
* Shared dependencies
* Tree shaking
* Cache optimization
* Environment-specific configuration
* Automated builds
* Automated releases

## Testing Strategy

Testing is an important part of the project rather than an additional step after development.

The testing strategy will cover different levels:

```text
Unit Tests
    │
    ▼
Component Tests
    │
    ▼
Integration Tests
    │
    ▼
End-to-End Tests
```

The objective is to ensure that individual widgets can evolve without introducing regressions in other widgets.

## Analytics

Google Tag Manager will be integrated as an example of how cross-cutting functionality can be handled within the widget architecture.

The implementation will explore:

* Event tracking
* Data Layer integration
* Environment-specific configuration
* Avoiding duplicated analytics initialization
* Tracking interactions across widgets

## Development Goals

This project is also intended as a practical exploration of modern frontend architecture and development practices.

The main areas of focus are:

* Micro Frontend architecture
* Vue 3
* Vite
* TypeScript
* Tailwind CSS
* Automated testing
* Code quality
* Analytics
* CI/CD
* Build optimization
* Release automation

## Future Improvements

Possible future iterations include:

* Dynamic widget loading
* Improved dependency sharing
* Independent widget versioning
* Automated semantic versioning
* CI/CD pipelines
* Automated deployments
* Performance monitoring
* Error tracking
* Advanced caching strategies
* CMS integration testing

## Status

🚧 **Work in progress**

This project is currently being developed and the architecture may evolve as different approaches are evaluated and validated.

