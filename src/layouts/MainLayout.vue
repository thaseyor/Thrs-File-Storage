<template>
  <div>
    <q-tabs v-model="tab" class="text-teal">
      <q-tab name="public" icon="delete" label="Public" />
      <q-tab name="private" icon="lock" label="Private" />
    </q-tabs>
    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="public">
        <section style="display: flex; justify-content: center">
          <q-uploader
            url="http://localhost:4444/upload"
            label="Individual upload"
            multiple
            style="max-width: 300px"
          />
        </section>
        <div
          class="full-width row wrap  items-center content-center q-gutter-md q-pt-md"
        >
          <q-card class="my-card" v-for="(file, key) in files" :key="key">
            <q-card-section>
              <p
                style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
              >
                {{ file.name }}
                <q-tooltip
                  v-if="file.name.length > 31"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  {{ file.name }}
                </q-tooltip>
              </p>
              <p>{{ file.size }}</p>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>

      <q-tab-panel name="private">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { api } from '../boot/axios'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const tab = ref('public')
    const files = ref([])

    onMounted(async () => {
      const { data } = await api.get('public').catch(res => console.log(res))

      files.value = data
    })

    return { files, tab }
  }
})
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
  height: 150px
</style>
