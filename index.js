import { createApp } from 'vue'

// lib
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import Icon from './components/Icon'
import request from './utils/request'
import './router/routerGuards'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'

// style
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import './styles/index.scss' // global css

const GlobalComps = [Icon]

const defaultUi = {
  size: 'small',
  zIndex: 3000,
  locale: locale
}

export default (options = {}) => {
  const app = createApp(App)

  const {
    ElementOptions,
    config,
    routes,
    globalComps,
    mockApis,
    disableDefaultMockApi,
    nav,
    use
  } = options

  store.dispatch('app/setConfig', {
    nav: nav || []
  })
  store.dispatch('settings/loadLocalAdmin', config || {})

  GlobalComps.concat(globalComps || []).forEach(item => {
    app.component(item.name, item)
  })

  // mock api
  if (process.env.VUE_APP_ENABLE_MOCK === 'true') {
    const { mockXHR } = require('./mock')
    mockXHR(mockApis || [], disableDefaultMockApi === undefined ? false : !!disableDefaultMockApi)
  }

  app.config.globalProperties.$http = request;

  (routes || []).forEach(item => {
    router.addRoute(item)
  })

  app.use(store)
    .use(router)
    .use(ElementPlus, ElementOptions || defaultUi);

  (use || []).forEach(item => {
    if (typeof item === 'object') {
      app.use(item)
    } else {
      app.use(item[0], item[1])
    }
  })

  router.isReady().then(() => app.mount('#app'))
}
