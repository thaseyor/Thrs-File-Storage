<template>
  <div>
    <header style="position: sticky;top: 0;background-color:white">
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
                  v-if="
                    file.contentType &&
                      file.contentType.split('/')[0] === 'image'
                  "
                  @click="showImage(file.name)"
                  flat
                  round
                  color="blue"
                  icon="open_in_new"
                />
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

        <q-dialog v-model="modal" class="z-top">
          <q-img :src="currentImage" />
        </q-dialog>
      </q-tab-panel>

      <q-tab-panel name="private">
        <section v-if="!logined" style="display: flex; justify-content: center">
          <auth-panel @logined="logined = true" />
        </section>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { api, axios } from '../includes/api'
import { Notify } from 'quasar'
import { formatDistanceToNow } from 'date-fns'
import FileDownload from 'js-file-download'
import AuthPanel from 'src/components/AuthPanel.vue'

export default defineComponent({
  components: { AuthPanel },
  name: 'MainLayout',
  setup() {
    const tab = ref('public')
    const modal = ref(false)
    const currentImage = ref('')
    const files = ref([])
    const logined = ref(window.localStorage.getItem('logined') || false)

    onMounted(async () => {
      const { data } = await api('public')

      files.value = data
    })

    const downloadFile = async file => {
      if (!file) return

      const { data: url } = await api(`public/${file}`)

      await axios
        .get(url, {
          responseType: 'blob'
        })
        .then(res => {
          FileDownload(res.data, file)
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

    const uploadURI = process.env.QENV_SERVER_URI + '/public'

    const formatDate = date => {
      return formatDistanceToNow(new Date(date))
    }

    const showImage = async image => {
      modal.value = true
      const { data: url } = await api(`public/${image}`)
      currentImage.value = url
    }

    return {
      files,
      tab,
      downloadFile,
      deleteFile,
      addFile,
      uploadURI,
      formatDate,
      modal,
      showImage,
      currentImage,
      logined
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
