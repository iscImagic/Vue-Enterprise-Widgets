import { createApp } from 'vue'
import type { WidgetModule } from '../../runtime/widget-contract'
import ContactForm from './ContactForm.vue'

export const contactFormWidget: WidgetModule = {
  mount(element) {
    const app = createApp(ContactForm)

    app.mount(element)

    return {
      unmount() {
        app.unmount()
      },
    }
  },
}
