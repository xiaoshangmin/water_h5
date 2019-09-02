import Vue from 'vue'
import Router from 'vue-router'
import Shop from '@/views/Shop.vue'
import Alipay from '@/views/Alipay.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/alipay',
			name: 'alipay',
			component: Alipay,
		}, 
		{
			path: "/",
			name: 'shop',
			component: Shop,
			meta: {
				title: '轻饮净水'
			}
		},
		{
			path: "/shop",
			name: 'shop',
			component: Shop,
			meta: {
				title: '轻饮净水'
			}
		},
		{
			path: "/comment",
			name: 'comment',
			component: () => import( /* webpackChunkName: "Comment" */ '@/views/Comment.vue'),
			meta: {
				title: '轻饮净水'
			}
		},
		{
			path: "/company",
			name: 'company',
			component: () => import( /* webpackChunkName: "Company" */ '@/views/Company.vue'),
			meta: {
				title: '轻饮净水'
			}
		},
		{
			path: "/cert",
			name: 'cert',
			component: () => import( /* webpackChunkName: "Cert" */ '@/views/Cert.vue'),
			meta: {
				title: '轻饮净水'
			}
		},
		{
			path: "/user",
			name: 'user',
			component: () => import( /* webpackChunkName: "User" */ '@/views/User.vue'),
			meta: {
				title: '轻饮净水'
			}
		}, {
			path: "/user/hire",
			name: 'hire',
			component: () => import( /* webpackChunkName: "Hire" */ '@/views/Hire.vue'),
		}, {
			path: "/user/service",
			name: 'service',
			component: () => import( /* webpackChunkName: "Service" */ '@/views/Service.vue'),
			meta: {
				title: '轻饮净水'
			}
		}, {
			path: "/shop/order",
			name: 'order',
			component: () => import( /* webpackChunkName: "Order" */ '@/views/Order.vue'),
		}, {
			path: "/shop/detail",
			name: 'detail',
			component: () => import( /* webpackChunkName: "Detail" */ '@/views/Detail.vue'),
		}
	]
})
