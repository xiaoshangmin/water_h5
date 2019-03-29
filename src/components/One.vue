<template>
	<div>
		<img :src="firstImg" style="width: 100%">
		<van-sku v-model="showBase" :show-add-cart-btn="show_cart" @buy-clicked="onBuyClicked" :sku="skuData.sku" :goods="skuData.goods_info">
			<span slot="sku-stepper"></span>
		</van-sku>
		<!-- <van-button block type="primary" @click="showBase = true"> -->
		<van-button block type="primary" @click="go()">
			马上租赁（限时免费安装）
		</van-button>
	</div>
</template>

<script>
	export default {
		name: 'One',
		mounted() {
			const _this = this
			_this.$http.get('/api/sku').then(function(res) {
				res = res.data
				_this.skuData = res.data
			});
		},
		data() {
			return {
				firstImg: 'https://i.loli.net/2019/01/18/5c413f8a3d2d2.jpg',
				show_cart: false,
				showBase: false,
				skuData: {
					kdt_id: 55,
					sku: {
						tree: [],
						list: []
					}
				}
			}
		},
		methods: {
			onBuyClicked(data) {
				this.$router.push({path:"/shop/order",query:data.selectedSkuComb})
			},
			go(){
				this.$router.push({path:'shop'});
			}
		}
	}
</script>
