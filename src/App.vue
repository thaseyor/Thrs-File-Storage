<template>
  <div id="q-app">
    <router-view />
    <update-notification />
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import UpdateNotification from './components/UpdateNotification'

export default defineComponent({
  name: 'App',
  components: { UpdateNotification }
})
</script>
