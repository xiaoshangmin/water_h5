import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueClipboard from 'vue-clipboard2'
import axios from 'axios'

if (process.env.NODE_ENV == 'production') {
	axios.defaults.baseURL = 'https://wowyou.cc/api/'
} else {
	axios.defaults.baseURL = 'http://xsm.water.com:90/api/'
}
// axios.defaults.withCredentials=true
Vue.prototype.$http = axios
Vue.use(VueClipboard)
import {
	Tabbar,
	TabbarItem,
	Sku,
	Button,
	List,
	Cell,
	CellGroup,
	Tab,
	Tabs,
	Card,
	NavBar,
	Row,
	Col,
	Icon,
	Toast,
	AddressEdit,
	SubmitBar,
	Area,
	Panel,
	ContactCard,
	ContactList,
	ContactEdit,
	Popup,
	AddressList,
	Field,
	Collapse,
	CollapseItem,
	Swipe,
	SwipeItem,
	GoodsAction,
	GoodsActionBigBtn,
	GoodsActionMiniBtn,
	Loading,
	CouponCell,
	CouponList,
	RadioGroup,
	Radio,
	Tag
} from 'vant';
Vue.use(Tabbar).use(TabbarItem).use(Sku).use(Button).use(Icon).use(Toast).use(NavBar).use(AddressEdit).use(SubmitBar).use(
		Area).use(Panel).use(ContactCard).use(ContactList).use(ContactEdit).use(Popup).use(Field).use(Collapse).use(
		CollapseItem).use(GoodsActionBigBtn).use(GoodsActionMiniBtn).use(Loading).use(List).use(Cell).use(CellGroup).use(Tab)
	.use(Tabs).use(Card).use(Row).use(Col).use(AddressList).use(Swipe).use(
		SwipeItem).use(GoodsAction).use(CouponCell).use(CouponList).use(RadioGroup).use(Radio).use(Tag)
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
