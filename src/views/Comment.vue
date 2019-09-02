<template>
	<div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<van-cell v-for="(item,key) in list" :key="key">
				<van-row type="flex" justify="center">
					<van-col offset="1" span="3" class="avatar">
						<van-image round width="30" height="30" :src="item.headimgurl" />
					</van-col>
					<van-col span="20" class="user">
						<van-row type="flex">
							<van-col span="24">
								{{item.nickname}}
							</van-col>
						</van-row>
						<van-row>
							<van-col span="24">
								{{item.create_time}}
							</van-col>
						</van-row>
					</van-col>
				</van-row>

				<van-row type="flex" justify="center">
					<van-col offset="1" span="23">
						{{item.content}}
					</van-col>
				</van-row>
				<van-row type="flex" justify="center">
					<van-col offset="1" span="23">
						<van-grid :border="false" :column-num="3">
							<van-grid-item v-for="(image,index) in item.images" :key="index" @click="showImagePreview(key,index)">
								<van-image :src="image" fit="cover" width="100%" height="70" />
							</van-grid-item>
						</van-grid>
					</van-col>
				</van-row>
			</van-cell>
		</van-list>
	</div>
</template>

<script>
	import {
		ImagePreview
	} from 'vant'
	export default {
		data() {
			return {
				list: [],
				loading: false,
				finished: false,
				goods_id: 0,
				page: 1
			}
		},
		created() {
			this.goods_id = this.$route.query.goodsId; 
		},
		methods: {
			onLoad() {
				this.getComments(this.page) 
				this.page++
			},
			getComments(page) {
				this.$http.post('comments/list', {
					goods_id: this.goods_id,
					page: page
				}).then(res => {
					res = res.data
					if (res.data.length) {
						this.list = this.list.concat(res.data);
						this.loading = false;
					}
					if (res.data.length < 20) {
						this.loading = false;
						this.finished = true;
					}
				})
			},
			showImagePreview(key, position) {
				let images = this.list[key]['images']
				ImagePreview({
					images,
					startPosition: typeof position === 'number' ? position : 0
				});
			}
		}
	}
</script>

<style lang="less">
	// .van-grid {
	// 	padding: 5px 10px;
	// }
	.avatar {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.van-grid-item__content {
		padding: 1px;
	}

	/* .van-col--20,.van-col--4{
		display: flex;
		align-items: center;
		justify-content: center;
	} */
	.user {
		font-size: 13px;
		line-height: 30px;
		text-align: left;
	}
</style>
