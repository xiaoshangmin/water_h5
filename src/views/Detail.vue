<template>
	<div>
		<van-nav-bar title="商品详情" style="background-color: #f7f7f7;" left-arrow @click-left="onClickLeft" />
		<div class="goods">
			<van-swipe class="goods-swipe" indicator-color="white" :loop="loop">
				<van-swipe-item v-for="(thumb,index) in goods.goods_images" :key="index">
					<img :src="thumb">
				</van-swipe-item>
			</van-swipe>

			<van-cell-group>
				<van-cell>
					<div class="goods-title">{{ goods.name }}</div>
					<div class="goods-price">¥{{ goods.market_price }}</div>
				</van-cell>
				<van-cell class="goods-express">
					<van-col span="10">运费：0</van-col>
				</van-cell>
			</van-cell-group>

			<van-collapse v-model="activeNames" accordion @change="change">
				<van-collapse-item title="商品详情" name="1" :value="value">
					<p v-html="goods.goods_content"></p>
				</van-collapse-item>
			</van-collapse>

			<van-goods-action>
				<van-goods-action-big-btn primary @click="showBase = true">
					立即购买
				</van-goods-action-big-btn>
			</van-goods-action>

			<van-sku v-model="showBase" :show-add-cart-btn="show_cart" @buy-clicked="onBuyClicked" :sku="skuData.sku" :goods="goodsInfo">
				<span slot="sku-stepper"></span>
			</van-sku>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				show_cart: false,
				showBase: false,
				loop: false,
				value: '收起',
				activeNames: "1",
				skuData: {
					kdt_id: 55,
					sku: {
						tree: [],
						list: []
					}
				},
				goodsInfo:{},
				goods: {
					name: '',
					market_price: 0,
					express: '',
					remain: 0,
					goods_images: [],
					goods_content: ''
				}
			};
		},
		mounted() {
			this.$emit('showTab', false)
			const _this = this;
			let goodsId = this.$route.query.goodsId;
			_this.$http.get('goods/' + goodsId).then(function(res) {
				res = res.data
				_this.goods = res.data
				_this.skuData = res.data.spec
				_this.goodsInfo = res.data.spec.goods_info 
			});
		},
		methods: {
			change(activeNames) {
				if (1 != activeNames) {
					this.value = '展开'
				} else {
					this.value = '收起'
				}
			},
			formatPrice() {
				return '¥' + (this.goods.market_price / 100).toFixed(2);
			},
			onClickLeft() {
				this.$router.go(-1)
			},
			onBuyClicked(data) {
				this.$router.push({
					path: "/shop/order",
					query: data.selectedSkuComb
				})
			}
		}
	};
</script>

<style lang="less">
	
	.van-collapse-item__content img {
		width: 100% !important;
	}

	.goods {
		padding-bottom: 50px;

		&-swipe {
			img {
				width: 100%;
				display: block;
			}
		}

		&-title {
			font-size: 16px;
		}

		&-price {
			color: #f44;
		}

		&-express {
			color: #999;
			font-size: 12px;
			padding: 5px 15px;
		}

		&-cell-group {
			margin: 15px 0;

			.van-cell__value {
				color: #999;
			}
		}
	}
</style>
