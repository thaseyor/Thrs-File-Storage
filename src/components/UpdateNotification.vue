<template>
  <div><!-- ABOBA --></div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'UpdateNotification',
  setup() {
    const refreshing = ref(false)
    const registration = ref(null)

    const updateAvailable = event => {
      registration.value = event.detail
      Notify.create({
        message: 'An update is available',
        color: 'positive',
        actions: [{ label: 'Update', color: 'white', handler: refreshApp }]
      })
    }

    const refreshApp = () => {
      if (!registration.value || !registration.value.waiting) return
      registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
    }

    document.addEventListener('swUpdated', updateAvailable, { once: true })
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing.value) return
      refreshing.value = true
      window.location.reload()
    })
  }
})
</script>
