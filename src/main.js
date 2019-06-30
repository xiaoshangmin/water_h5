import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant'
import router from './router'
import axios from 'axios'
import VueClipboard from 'vue-clipboard2'

import 'vant/lib/index.css'

if (process.env.NODE_ENV == 'production') {
	axios.defaults.baseURL = 'https://wowyou.cc/api/'
} else {
	axios.defaults.baseURL = 'http://xsm.water.com:90/api/'
}
// axios.defaults.withCredentials=true
Vue.prototype.$http = axios
Vue.use(VueClipboard)
Vue.use(Vant);

Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	next();
});

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
