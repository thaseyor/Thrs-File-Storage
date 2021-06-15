<template>
  <div>
    <q-tabs v-model="tab" class="text-teal">
      <q-tab name="public" icon="delete" label="Public" />
      <q-tab name="private" icon="lock" label="Private" />
    </q-tabs>
    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="public" style="display: flex; justify-content: center">
        <q-file
          v-model="files"
          label="Pick files"
          filled
          multiple
          append
          style="width: 65%"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" />
          </template>
        </q-file>
      </q-tab-panel>

      <q-tab-panel name="private">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import { api } from '../boot/axios';
export default defineComponent({
  name: 'MainLayout',
  setup(props, context) {
    const files = ref(null);

    const tab = ref('public');

    onMounted(() => {
      api('').catch((res) => console.log(res));
    });

    return { files, tab };
  },
});
</script>
<style scoped></style>
