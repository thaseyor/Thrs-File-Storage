import PinchZoom from 'vue-pinch-zoom'

import { boot } from 'quasar/wrappers'

export default boot(({ Vue }) => {
  Vue.component('pinch-zoom', PinchZoom)
})
