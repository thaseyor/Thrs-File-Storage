<template>
  <div>
    <header
      class="z-top s"
      style="position: sticky;top: 0;background-color:white"
    >
      <q-tabs v-model="tab" class="text-primary">
        <q-tab name="public" icon="delete" label="Public" />
        <q-tab name="private" icon="lock" label="Private" />
      </q-tabs>
      <q-separator />
    </header>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="public" style="overflow:hidden">
        <section style="display: flex; justify-content: center">
          <q-uploader
            :url="uploadURI"
            label="Upload files"
            multiple
            @uploaded="addFile"
            style="max-width: 300px"
          />
        </section>
        <div
          class="full-width row wrap  items-center content-center q-gutter-md q-pt-md"
        >
          <q-card class="my-card" v-for="(file, key) in files" :key="key">
            <q-card-section>
              <p
                class="text-subtitle1"
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
              <p>File size: {{ file.size }}</p>
              <p>
                Uploaded:
                {{ formatDate(file.uploaded) }}
              </p>
              <q-card-actions align="right">
                <q-btn
                  @click="downloadFile(file.name)"
                  flat
                  round
                  color="blue"
                  icon="download"
                />
                <q-btn
                  @click="deleteFile(file.name)"
                  flat
                  round
                  color="blue"
                  icon="delete"
                />
              </q-card-actions>
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
import { api } from '../includes/api'
import { Notify } from 'quasar'
import { formatDistanceToNow } from 'date-fns'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const tab = ref('public')
    const files = ref([])

    onMounted(async () => {
      const { data } = await api('public').catch(res => console.log(res))

      files.value = data
    })

    const downloadFile = async file => {
      if (!file) return

      const { data: url } = await api(`public/${file}`)

      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob)
          forceDownload(blobUrl, file)
        })
    }

    const deleteFile = async file => {
      const { data } = await api.delete(`public/${file}`)
      files.value = files.value.filter(el => el.name !== file)
      Notify.create(data.message)
    }
    const addFile = async info => {
      const res = JSON.parse(info.xhr.response)
      files.value.push(res.file)
    }

    const forceDownload = (blob, filename) => {
      const a = document.createElement('a')
      a.download = filename
      a.href = blob
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
    const uploadURI = process.env.QENV_SERVER_URI + '/public'

    const formatDate = date => {
      return formatDistanceToNow(new Date(date))
    }

    return {
      files,
      tab,
      downloadFile,
      deleteFile,
      addFile,
      uploadURI,
      formatDate
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
