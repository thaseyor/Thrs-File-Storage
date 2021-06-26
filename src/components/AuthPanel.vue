<template>
  <div>
    <section class="text-grey-5 q-mt-lg" style="background-color:#1d1d1d">
      <q-tabs v-model="tab" class="q-pb-lg" dense align="justify" dark>
        <q-tab name="login" icon="login" class="q-pt-xs" label="Login" />
        <q-tab
          name="signup"
          class="q-pt-xs"
          icon="app_registration"
          label="Signup"
        />
      </q-tabs>
      <div class="text-h6 q-px-md text-center">
        You have to login in order to gain an access to your storage
      </div>
    </section>
    <q-tab-panels v-model="tab" dark class="text-grey-5">
      <q-tab-panel name="login">
        <q-form @submit="auth('login', user)" class="q-gutter-md q-pt-md">
          <q-input
            filled
            v-model="user.login"
            label="Login"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
            dark
            color="text-grey-5"
          />

          <q-input
            filled
            v-model="user.password"
            label="Password"
            type="password"
            lazy-rules
            dark
            color="text-grey-5"
            :rules="[
              val =>
                (val !== null &&
                  val !== '' &&
                  val.length > 8 &&
                  val.length < 20) ||
                'Password should be longer than 8 symbols and shorter than 20'
            ]"
          />

          <div>
            <q-btn
              label="Submit"
              type="submit"
              color="grey-9"
              text-color="grey-5"
            />
          </div>
        </q-form>
      </q-tab-panel>

      <q-tab-panel name="signup">
        <q-form @submit="auth('signup', newUser)" class="q-gutter-md q-pt-md">
          <q-input
            filled
            v-model="newUser.login"
            label="Login"
            dark
            color="text-grey-5"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />

          <q-input
            filled
            type="password"
            v-model="newUser.password"
            label="Password"
            dark
            color="text-grey-5"
            lazy-rules
            :rules="[
              val =>
                (val !== null &&
                  val !== '' &&
                  val.length > 8 &&
                  val.length < 20) ||
                'Password should be longer than 8 symbols and shorter than 20'
            ]"
          />

          <q-input
            filled
            v-model="newUser.confirmPassword"
            label="Confirm Password"
            type="password"
            dark
            color="text-grey-5"
            lazy-rules
            :rules="[
              val =>
                (val !== null &&
                  val !== '' &&
                  val.length > 8 &&
                  val.length < 20) ||
                'Password should be longer than 8 symbols and shorter than 20',
              val => val === newUser.password || 'Passwords do not match'
            ]"
          />
          <div>
            <q-btn
              label="Submit"
              type="submit"
              color="grey-9"
              text-color="grey-5"
            />
          </div>
        </q-form>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import { api } from '../includes/api'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'AuthPanel',
  emits: 'logined',
  setup(props, { emit }) {
    const user = ref({ login: null, password: null })
    const newUser = ref({ login: null, password: null, confirmPassword: null })
    const tab = ref('login')
    const auth = async (action, body) => {
      const res = await api.post(`auth/${action}`, body).catch(err =>
        Notify.create({
          type: 'negative',
          message: err.response.data.message
        })
      )
      if (res.data.statusCode === 200) {
        window.localStorage.setItem('logined', true)
        emit('logined')
      }
    }
    return { user, tab, auth, newUser }
  }
})
</script>
