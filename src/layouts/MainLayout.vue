<template>
  <div>
    <header style="position: sticky;top: 0;z-index:40" class="bg-grey-10">
      <q-tabs v-model="tab" class="text-grey-5">
        <q-tab name="public" icon="delete" label="Public" />
        <q-tab name="private" icon="lock" label="Private" />
      </q-tabs>
      <q-separator />
    </header>
    <q-tab-panels v-model="tab" animated class="transparent">
      <q-tab-panel dark name="public" style="overflow:hidden">
        <storage-area type="public" />
      </q-tab-panel>
      <q-tab-panel name="private">
        <storage-area v-if="logined" type="private" @logout="logout()" />
        <section v-else style="display: flex; justify-content: center">
          <auth-panel @logined="logined = true" />
        </section>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

import AuthPanel from 'src/components/AuthPanel.vue'
import StorageArea from 'src/components/StorageArea.vue'

export default defineComponent({
  components: { AuthPanel, StorageArea },
  name: 'MainLayout',

  setup() {
    const tab = ref('public')
    const logined = ref(window.localStorage.getItem('logined') || false)
    const logout = () => {
      logined.value = false
      window.localStorage.setItem('logined', false)
    }

    return {
      tab,
      logined,
      logout
    }
  }
})
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
  height: 190px
</style>
