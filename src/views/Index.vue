<template>
	<div>
		<div class="van_tab">
			<van-tabs v-model="active" sticky swipeable>
				<!--租赁-->
				<van-tab title="租赁">
					<one></one>
				</van-tab>
				<!--评论列表-->
				<van-tab title="评论">
					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
						<van-row v-for="(item,index) in list" :key="index" class="comment">
							<van-col span="6" class="avatar">
								<img :src="item.avatar" />
							</van-col>
							<van-col span="18">
								<van-row class="content">
									<span>{{item.comment}}</span>
								</van-row>
								<van-row class="comment_time">
									<span>2019-01-01</span>
								</van-row>
							</van-col>
						</van-row>
					</van-list>
				</van-tab>
				<!--服务说明-->
				<van-tab title="服务说明">
					<img :src="threeImg" alt="" width="100%">
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script>
	import One from '@/components/One.vue'
	export default {
		components:{
			One
		},
		data() {
			return {
				list: [],
				loading: false,
				finished: false,
				active: 0,
				threeImg: 'https://i.loli.net/2019/01/18/5c414c011a392.jpg',
			}
		},
		methods: {
			onLoad() {
				const _this = this;
				_this.$http.get('/api/comment').then(function(res) {
					res = res.data
					if (1 == res.code) {
						_this.list = res.data;
					}
					_this.loading = false;
					_this.finished = true;
				});
			}
		}
	};
</script>

<style lang="less">
	.sku-container {
		padding: 0 15px;
	}

	.van_tab {
		margin-bottom: 50px;
	}

	.content {
		padding-top: 10px;
		padding-right: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.comment {
		position: relative;
		border-bottom: 2px solid #eee;
	}

	.avatar img {
		width: 80px;
		padding: 2px;
	}

	.comment_time {
		position: absolute;
		right: 10px;
		bottom: 1px;
	}
</style>
