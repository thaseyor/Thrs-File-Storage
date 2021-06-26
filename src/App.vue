<template>
  <div id="q-app">
    <router-view />
    <update-notification />
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import UpdateNotification from './components/UpdateNotification'
import('./register-service-worker')

export default defineComponent({
  name: 'App',
  components: { UpdateNotification }
})
</script>
