<template>
	<div>
		<div class="van_shop" v-for="(item,index) in list" :key="index" @click="go(item.id)">
			<van-row>
				<van-col span="24">
					<img :src="item.goods_image" style="width: 100%;" />
				</van-col>
			</van-row>
			<div class="van-hairline--bottom"></div>
			<van-row span="24" class="content">
				<p><span style="color: red;">￥{{item.market_price}}</span></p>
				<p>{{item.name}}</p> 
			</van-row>
		</div>
	</div>
</template>

<script>
	// import wx from 'weixin-js-sdk'
	export default {
		created() {
			this.$emit('changeTab', 1)
			const _this = this
			_this.$http.get('goods').then(function(res) {
				res = res.data
				_this.list = res.data
			});
			// var url = location.href.split('#')[0];
			// 			_this.$http.get('index/share?url='+url).then(function(res) {
			// 				var data = res.data.data
			// 				var config = {
			// 					debug:data.debug,
			// 					appId: data.appId,
			// 					timestamp: data.timestamp,
			// 					nonceStr: data.nonceStr,
			// 					signature: data.signature,
			// 					jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
			// 				};
			// 				wx.config(config);
			// 			});
		},
		data() {
			return {
				isshow: true,
				imageURL: 'http://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
				list: [],
			};
		},
		methods: {
			formatPrice(price) {
				return (price / 100).toFixed(2);
			},
			go(goodsId) {
				this.$router.push({
					path: '/shop/detail',
					query: {
						goodsId: goodsId
					}
				})
			}
		}
	};
</script>

<style>
	.van_shop {
		margin-bottom: 50px;
		border-bottom: 5px solid #eee;
	}

	.content {
		text-align: center;
	}
</style>
