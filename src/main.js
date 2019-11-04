import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueChatScroll from 'vue-chat-scroll'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueChatScroll)
Vue.use(VueClipboard);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
