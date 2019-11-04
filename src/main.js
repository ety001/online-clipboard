import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueChatScroll from 'vue-chat-scroll'

Vue.use(VueChatScroll)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
