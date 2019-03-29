<template>
	<div id="app">
		<router-view @changeTab="changeTab" @showTab="showTab" />
		<van-tabbar v-model="active" v-show="isshow">
			<van-tabbar-item icon="shop-o" to="/shop">产品服务</van-tabbar-item>
			<van-tabbar-item icon="description" to="/company">企业简介</van-tabbar-item>
			<van-tabbar-item icon="idcard" to="/cert">资质</van-tabbar-item>
			<van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				transitionName: 'pop-out',
				active: 0,
				isshow: true, 
			}
		},
		created() {
			var token = ''
			// 验证授权
			if (process.env.NODE_ENV == 'production') {
				token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
			} else {
				token = "8aXjyLPeGzrOWlVn8b15MqQN7g2k6BEA";
			}
			if (token == '') {
				location.href = '/api/wx/oauth?url=' + location.href.split('#')[0]; 

			}
			//http request 拦截器
			this.$http.interceptors.request.use(
				config => {
					if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
						config.headers.Token = `${token}`;
					}
					return config;
				},
				err => {
					return Promise.reject(err);
				});

		},
		watch: {
			'$route'(to, from) {
				if (to.name == 'user' || to.name == 'cert' || to.name == 'company' || to.name == 'shop' || to.name == '') {
					this.isshow = true
					switch (to.name) {
						case 'shop':
							this.active = 0;
							break;
						case 'company':
							this.active = 1
							break;
						case 'cert':
							this.active = 2
							break;
						case 'user':
							this.active = 3
							break;
						default:
							break;
					}
				} else {
					this.isshow = false
				}
				const toDepth = to.path.split('/').length
				const fromDepth = from.path.split('/').length
				this.transitionName = toDepth < fromDepth ? 'pop-out' : 'pop-in'
			}
		},
		methods: {
			changeTab(res) {
				this.active_tab = res
			},
			showTab(res) {
				this.isshow = res
			}
		}
	}
</script>
<style>
</style>
