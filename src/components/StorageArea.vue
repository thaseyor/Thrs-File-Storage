<template>
  <div>
    <section style="display: flex; justify-content: center" class="text-grey-5">
      <q-uploader
        :url="uploadURI"
        label="Upload files"
        multiple
        dark
        color="grey-10"
        text-color="grey-5"
        with-credentials
        @uploaded="addFile"
        style="width: 400px"
      />
    </section>
    <div class="row wrapq-pt-md q-col-gutter-lg q-pt-md" v-if="files.length">
      <div
        class="col-xs-12 col-sm-6 col-lg-3"
        v-for="(file, key) in files"
        :key="key"
      >
        <q-card class="text-grey-5" dark>
          <q-card-section>
            <p class="text-subtitle1 ellipsis">
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
                icon="open_in_new"
              >
                <q-tooltip :delay="350" :offset="[0, 10]">
                  Show image
                </q-tooltip>
              </q-btn>

              <q-btn @click="shareUrl(file.name)" flat round icon="link">
                <q-tooltip :delay="350" :offset="[0, 10]">
                  Copy to clipboard
                </q-tooltip>
              </q-btn>

              <q-btn
                @click="downloadFile(file.name)"
                flat
                round
                icon="download"
              >
                <q-tooltip :delay="350" :offset="[0, 10]">
                  Download file
                </q-tooltip>
              </q-btn>

              <q-btn @click="deleteFile(file.name)" flat round icon="delete">
                <q-tooltip :delay="350" :offset="[0, 10]">
                  Remove file from storage
                </q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
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
      <q-spinner color="grey-5" size="3em" />
    </div>
    <q-dialog v-model="modal" style="z-index:50">
      <pinch-zoom
        :limitZoom="3"
        style="cursor:move"
        :disableZoomControl="'disable'"
      >
        <img :src="currentImage" />
      </pinch-zoom>
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
    const uploadURI = process.env.SERVER_URI + `/${type}`
    const formatDate = date => {
      return formatDistanceToNow(new Date(date))
    }
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

    const loading = ref(true)
    const files = ref([])
    const getFiles = async () => {
      const { data } = await api(type).catch(err => validate(err, getFiles))
      files.value = data
      loading.value = false
    }

    const getSignedUrl = async file => {
      const { data } = await api(`${type}/${file}`).catch(err =>
        validate(err, downloadFile)
      )
      return data.url
    }

    const shareUrl = async file => {
      const url = await getSignedUrl(file)

      const data = [
        new ClipboardItem({
          'text/plain': new Blob([url], { type: 'text/plain' })
        })
      ]

      navigator.clipboard.write(data).then(
        () => {
          Notify.create({
            type: 'positive',
            message: 'Copied to clipboard successfully!'
          })
        },
        () => {
          Notify.create({
            type: 'negative',
            message: 'Unable to write to clipboard.'
          })
        }
      )
    }

    const downloadFile = async file => {
      const url = await getSignedUrl(file)
      await axios
        .get(url, {
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

    const currentImage = ref('')
    const modal = ref(false)
    const showImage = async image => {
      currentImage.value = ''
      modal.value = true
      currentImage.value = await getSignedUrl(image)
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
      loading,
      shareUrl
    }
  }
})
</script>
