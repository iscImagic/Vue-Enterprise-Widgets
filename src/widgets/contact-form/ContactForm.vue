<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
}
</script>

<template>
  <form class="contact-form" @submit.prevent="handleSubmit">
    <h2>Formulario de contacto</h2>

    <div class="contact-form__field">
      <label for="contact-name">Nombre</label>
      <input
        id="contact-name"
        v-model="name"
        type="text"
        placeholder="Escribe tu nombre"
        required
        @input="submitted = false"
      />
    </div>

    <div class="contact-form__field">
      <label for="contact-email">Correo electrónico</label>
      <input
        id="contact-email"
        v-model="email"
        type="email"
        placeholder="correo@ejemplo.com"
        required
        @input="submitted = false"
      />
    </div>

    <div class="contact-form__field">
      <label for="contact-message">Mensaje</label>
      <textarea
        id="contact-message"
        v-model="message"
        placeholder="¿En qué podemos ayudarte?"
        rows="4"
        required
        @input="submitted = false"
      />
    </div>

    <button type="submit" class="contact-form__button">Enviar mensaje</button>

    <p v-if="submitted" class="contact-form__success" role="status">
      Formulario validado. Gracias, {{ name }}.
    </p>
  </form>
</template>

<style scoped>
.contact-form {
  display: grid;
  gap: 16px;
  max-width: 480px;
  padding: 24px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-family: Arial, sans-serif;
}

.contact-form h2 {
  margin: 0;
  font-size: 1.5rem;
}

.contact-form__field {
  display: grid;
  gap: 6px;
}

.contact-form__field label {
  font-weight: 600;
}

.contact-form__field input,
.contact-form__field textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border: 1px solid #9ca3af;
  border-radius: 6px;
  font: inherit;
}

.contact-form__button {
  padding: 12px 16px;
  border: 0;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font: inherit;
  cursor: pointer;
}

.contact-form__success {
  margin: 0;
  color: #15803d;
}
</style>
