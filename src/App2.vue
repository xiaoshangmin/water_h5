<template>
	<div id="app">
		<transition :name="transitionName">
			<router-view @changeTab="changeTab" @showTab="showTab"/>
		</transition>
		<van-tabbar v-model="active_tab" v-show="isshow">
			<van-tabbar-item icon="home-o" to="/">按时租赁</van-tabbar-item>
			<van-tabbar-item icon="search" to="/shop">产品服务</van-tabbar-item>
			<van-tabbar-item icon="friends-o" to="/company">企业简介</van-tabbar-item>
			<van-tabbar-item icon="setting-o" to="/cert">资质</van-tabbar-item>
			<van-tabbar-item icon="setting-o" to="/user">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				transitionName: 'pop-out',
				active_tab: 0,
				isshow: true,
			}
		},
		watch: {
			'$route'(to, from) {
				if (to.name == 'user' || to.name == 'cert' || to.name == 'company' || to.name == 'shop' || to.name == 'index') {
					this.isshow = true
					switch (to.name) {
						case 'shop':
							this.active_tab = 1;
							break;
						case 'company':
							this.active_tab = 2
							break;
						case 'cert':
							this.active_tab = 3
							break;
						case 'user':
							this.active_tab = 4
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
		methods:{
			changeTab(res){
				this.active_tab = res
			},
			showTab(res){
				this.isshow = res
			}
		}
	}
</script>
<style>
	.pop-out-enter-active,
	.pop-out-leave-active,
	.pop-in-enter-active,
	.pop-in-leave-active {
		will-change: transform;
		transition: all 500ms;
		height: 100%;
		top: 0;
		position: absolute;
		backface-visibility: hidden;
		perspective: 1000;
	}

	.pop-out-enter {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}

	.pop-out-leave-active {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}

	.pop-in-enter {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}

	.pop-in-leave-active {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}
</style>
