const loadedStyles = new WeakMap<ShadowRoot, Map<string, Promise<void>>>()

function loadStyle(url: string, shadowRoot: ShadowRoot): Promise<void> {
  let rootStyles = loadedStyles.get(shadowRoot)

  if (!rootStyles) {
    rootStyles = new Map<string, Promise<void>>()
    loadedStyles.set(shadowRoot, rootStyles)
  }

  const existingStyle = rootStyles.get(url)

  if (existingStyle) {
    return existingStyle
  }

  const promise = new Promise<void>((resolve, reject) => {
    const link = document.createElement('link')

    link.rel = 'stylesheet'
    link.href = url

    link.onload = () => resolve()

    link.onerror = () => {
      rootStyles?.delete(url)
      link.remove()

      reject(new Error(`Failed to load widget stylesheet: ${url}`))
    }

    shadowRoot.appendChild(link)
  })

  rootStyles.set(url, promise)

  return promise
}

export async function loadWidgetStyles(styles: string[], shadowRoot: ShadowRoot): Promise<void> {
  await Promise.all(styles.map((url) => loadStyle(url, shadowRoot)))
}
