<template>
  <div>
    <section style="display: flex; justify-content: center">
      <q-uploader
        :url="uploadURI"
        label="Upload files"
        multiple
        with-credentials
        @uploaded="addFile"
        style="max-width: 300px"
      />
    </section>
    <div
      class="full-width row wrap  items-center content-center q-gutter-md q-pt-md"
      v-if="files.length"
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
                file.contentType && file.contentType.split('/')[0] === 'image'
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
    <div
      v-else-if="loading === false"
      class="text-h6 fit row wrap justify-center items-center content-start q-mt-xl"
    >
      There are no files yet
    </div>
    <div
      v-else
      class="text-h6 fit row wrap justify-center items-center content-start q-mt-xl"
    >
      <q-spinner color="primary" size="3em" />
    </div>
    <q-dialog v-model="modal" class="z-top">
      <q-img :src="currentImage" />
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { api, axios } from '../includes/api'
import { Notify } from 'quasar'
import { formatDistanceToNow } from 'date-fns'
import FileDownload from 'js-file-download'

export default defineComponent({
  name: 'StorageArea',
  props: { type: String },
  emits: ['logout'],
  setup({ type }, { emit }) {
    const modal = ref(false)
    const currentImage = ref('')
    const files = ref([])
    const loading = ref(true)

    const validate = async (err, cb) => {
      {
        if (
          err.response.data.statusCode === 403 &&
          err.response.data.action === 'refresh'
        ) {
          await api.post(`auth/token`)
          cb()
        }
        if (
          (err.response.data.statusCode === 403 &&
            err.response.data.action === 'logout') ||
          err.response.data.statusCode === 401
        ) {
          emit('logout')
        }
      }
    }

    onMounted(() => {
      getFiles()
    })

    const getFiles = async () => {
      const { data } = await api(type).catch(err => validate(err, getFiles))
      files.value = data
      loading.value = false
    }

    const downloadFile = async file => {
      if (!file) return

      const { data } = await api(`${type}/${file}`).catch(err =>
        validate(err, downloadFile)
      )

      await axios
        .get(data.url, {
          responseType: 'blob'
        })
        .then(res => {
          FileDownload(res.data, file)
        })
    }

    const deleteFile = async file => {
      const { data } = await api
        .delete(`${type}/${file}`)
        .catch(err => validate(err, deleteFile))
      files.value = files.value.filter(el => el.name !== file)
      Notify.create(data.message)
    }

    const addFile = async info => {
      const res = JSON.parse(info.xhr.response)
      files.value.push(res.file)
    }

    const uploadURI = process.env.QENV_SERVER_URI + `/${type}`

    const formatDate = date => {
      return formatDistanceToNow(new Date(date))
    }

    const showImage = async image => {
      modal.value = true
      const { data } = await api(`${type}/${image}`).catch(err =>
        validate(err, showImage)
      )
      currentImage.value = data.url
    }

    return {
      files,
      downloadFile,
      deleteFile,
      addFile,
      uploadURI,
      formatDate,
      modal,
      showImage,
      currentImage,
      loading
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
