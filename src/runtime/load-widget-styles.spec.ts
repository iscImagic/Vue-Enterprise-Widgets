import { beforeEach, describe, expect, it } from 'vitest'
import { loadWidgetStyles } from './load-widget-styles'

function createShadowRoot(): ShadowRoot {
  const host = document.createElement('div')

  document.body.appendChild(host)

  return host.attachShadow({ mode: 'open' })
}

describe('load-widget-styles', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('loads a stylesheet successfully', async () => {
    const shadowRoot = createShadowRoot()
    const promise = loadWidgetStyles(['/widgets/contact-form.css'], shadowRoot)

    const link = shadowRoot.querySelector('link')

    expect(link).not.toBeNull()
    expect(link?.rel).toBe('stylesheet')
    expect(link?.getAttribute('href')).toBe('/widgets/contact-form.css')

    link?.dispatchEvent(new Event('load'))

    await expect(promise).resolves.toBeUndefined()
  })

  it('loads multiple stylesheets', async () => {
    const shadowRoot = createShadowRoot()
    const promise = loadWidgetStyles(
      ['/widgets/multiple-test-a.css', '/widgets/multiple-test-b.css'],
      shadowRoot,
    )

    const links = shadowRoot.querySelectorAll('link')

    expect(links).toHaveLength(2)

    links.forEach((link) => {
      link.dispatchEvent(new Event('load'))
    })

    await expect(promise).resolves.toBeUndefined()
  })

  it('does not load the same stylesheet twice', async () => {
    const shadowRoot = createShadowRoot()
    const styles = ['/widgets/shared-styles.css']

    const firstPromise = loadWidgetStyles(styles, shadowRoot)
    const secondPromise = loadWidgetStyles(styles, shadowRoot)

    const links = shadowRoot.querySelectorAll('link')

    expect(links).toHaveLength(1)

    links.item(0)?.dispatchEvent(new Event('load'))

    await Promise.all([firstPromise, secondPromise])
  })

  it('rejects when a stylesheet fails to load', async () => {
    const shadowRoot = createShadowRoot()
    const promise = loadWidgetStyles(['/widgets/failing-test.css'], shadowRoot)

    const link = shadowRoot.querySelector('link')

    expect(link).not.toBeNull()

    link?.dispatchEvent(new Event('error'))

    await expect(promise).rejects.toThrow(
      'Failed to load widget stylesheet: /widgets/failing-test.css',
    )

    expect(shadowRoot.querySelector('link')).toBeNull()
  })

  it('allows retrying a stylesheet after a loading error', async () => {
    const shadowRoot = createShadowRoot()
    const url = '/widgets/retry-test.css'

    const firstPromise = loadWidgetStyles([url], shadowRoot)
    const firstLink = shadowRoot.querySelector('link')

    firstLink?.dispatchEvent(new Event('error'))

    await expect(firstPromise).rejects.toThrow(`Failed to load widget stylesheet: ${url}`)

    const secondPromise = loadWidgetStyles([url], shadowRoot)
    const secondLink = shadowRoot.querySelector('link')

    expect(secondLink).not.toBeNull()
    expect(secondLink).not.toBe(firstLink)

    secondLink?.dispatchEvent(new Event('load'))

    await expect(secondPromise).resolves.toBeUndefined()
  })
})
