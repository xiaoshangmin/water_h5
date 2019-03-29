<template>
	<div>
		<van-nav-bar title="确认订单" style="background-color: #f7f7f7;" left-arrow @click-left="onClickLeft" />
		<!--选中的联系人-->
		<van-cell icon="location-o" size="large" is-link @click="showAddressList=true">
			<div class="">
				<van-row>
					<van-col span="14">收货人：{{address.name}} </van-col>
					<van-col span="10"> {{address.tel}}</van-col>
				</van-row>
				<van-row>
					<van-col span="24">{{address.address}}</van-col>
				</van-row>
			</div>
		</van-cell>
		<!-- 弹层 联系人列表 -->
		<van-popup v-model="showAddressList" position="bottom">
			<van-address-list v-model="chosenAddressId" :list="list" @select="onSelect" @add="onAdd" @edit="onEdit" />
		</van-popup>

		<!--弹层 新增/编辑联系人-->
		<van-popup v-model="showAddressDetail" position="top">
			<van-address-edit :area-list="areaList" :address-info="addressInfo" show-set-default @save="onSave" @change-detail="onChangeDetail" />
		</van-popup>

		<!-- 商品 -->
		<van-card :price="product.market_price" :desc="product.desc" :title="product.name" :thumb="product.goods_image" />

		<!-- 优惠券单元格 -->
		<van-coupon-cell :coupons="coupons" :chosen-coupon="chosenCoupon" @click="showList = true" />

		<!-- 优惠券列表 -->
		<van-popup v-model="showList" position="bottom">
			<van-coupon-list :coupons="coupons" :chosen-coupon="chosenCoupon" @change="onChange" @exchange="onExchange" />
		</van-popup>

		<!-- 高度自适应 -->
		<van-cell-group>
			<van-field v-model="remark" label="买家留言" type="textarea" placeholder="选填:填写内容已和卖家协商确认" rows="1" autosize />
		</van-cell-group>
		<!-- 支付方式 -->
		<van-radio-group v-model="radio">
			<van-cell-group>
				<van-cell title="支付宝支付" :icon="alipay_icon"  clickable @click="radio = '2'">
					<van-radio name="2"/>
				</van-cell>
				<van-cell title="微信支付" :icon="wxpay_icon" clickable @click="radio = '1'">
					<van-radio name="1" />
				</van-cell>
			</van-cell-group>
		</van-radio-group>

		<!-- 提交按钮 -->
		<van-submit-bar :price="lastPrice" button-text="提交订单" @submit="onSubmit" :loading="submitBarLoading" />
	</div>
</template>
<script>
	import wx from 'weixin-js-sdk'
	import _AP from '../components/ap.js'
	import AreaList from '@/components/area'; 
	export default {
		data() {
			return {
				showList: false,
				chosenCoupon: -1,
				coupon_id: 0,
				coupons: [],
				code: '',
				chosenAddressId: 1,
				addressList: false,
				showAddressList: false,
				addressInfo: '',
				showAddressDetail: false,
				disabled: true,
				submitBarLoading: false,
				radio: '2',
				wxpay_icon: "https://i.loli.net/2019/02/27/5c764a9e75770.jpg",
				alipay_icon: "https://i.loli.net/2019/02/27/5c764ae1d3460.jpg",
				areaList: AreaList,
				address: {
					id: 0,
					name: "",
					tel: "",
					address: ""
				},
				list: [],
				product: {
					market_price: 0,
					desc: "",
					name: "",
					goods_image: ""
				},
				remark: "",
				lastPrice: 0
			}
		},
		mounted() {
			this.getAddressList();
			this.getDefaultAddress();
			this.getProduct();
			this.getCoupon();

		},
		methods: {
			getAddressList() {
				const _this = this
				_this.$http.get('address').then(function(res) {
					res = res.data
					_this.list = res.data
					if (_this.list == null) {
						return;
					}
					_this.addressInfo = {}
				})
			},
			getDefaultAddress() {
				const _this = this
				_this.$http.get('address/default', {
					id: 2
				}).then(function(res) {
					res = res.data
					if (res.data == null) {
						return;
					}
					_this.address = res.data
				})
			},
			getProduct() {
				const _this = this
				//s1: _this.$route.query.s1,
				let goodsId = this.$route.query.goods_id;
				_this.$http.get('goods/' + goodsId).then(function(res) {
					res = res.data
					if (res.data == '[]') {
						return;
					}
					_this.product = res.data
					_this.lastPrice = _this.product.market_price * 100
				});

			},
			getCoupon() {
				const _this = this
				_this.$http.get('coupon').then(function(res) {
					res = res.data
					if (res.data.coupon_list.length == 0) {
						return;
					}
					let list = _this.coupons.concat(res.data.coupon_list);
					_this.coupons = list;
				});
			},
			wxpay(orderSn) {
				const _this = this
				_this.$http.put('order/' + orderSn).then(function(res) {
					let data = res.data.data
					let config = {
						debug: data.debug,
						appId: data.appId,
						timestamp: data.timestamp, // 必填，生成签名的时间戳
						nonceStr: data.nonceStr, // 必填，生成签名的随机串
						signature: data.paySign, // 支付签名
						jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
					};
					wx.config(config);
					wx.ready(function() {
						wx.chooseWXPay({
							timestamp: data.timestamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: data.signType,
							paySign: data.paySign, // 支付签名
							success: function() {
								// 支付成功后的回调函数
								_this.$router.push({
									path: '/user/hire'
								})
							}
						});
					});
					_this.submitBarLoading = false
				});

			},
			onSubmit() {
				this.submitBarLoading = true
				const _this = this
				if (this.radio == 2) {
					_this.$http.post('order/alipay',{
						code: _this.code,
						aid: _this.address.id,
						remark: _this.remark,
						gid: _this.$route.query.goods_id,
						coupon_id: _this.coupon_id
					}).then(function(res) {
						var data = res.data
						let c = _AP.ali.pay(data.data)
						location.href="https://wowyou.cc/mp/pay.html?goto="+c
						return
					})
					this.submitBarLoading = false
					return

				} else {
					_this.$http.post('order', {
						code: _this.code,
						aid: _this.address.id,
						remark: _this.remark,
						gid: _this.$route.query.goods_id,
						coupon_id: _this.coupon_id
					}).then(function(res) {
						res = res.data
						if (0 == res.code) {
							_this.$toast(res.msg)
							return
						}

						_this.wxpay(res.data.order_sn)
					})
				}
			},
			onClickLeft() {
				this.$router.go(-1)
			},
			onAdd() {
				this.showAddressList = false;
				this.showAddressDetail = true
				this.addressInfo = {}
			},
			onEdit(item, index) {
				this.addressInfo = this.list[index]
				this.showAddressDetail = true
				this.showAddressList = false
			},
			onSave(content) {
				const _this = this
				if (content.id == undefined) { //新增
					_this.$http.post('address', {
						content
					}).then(function(res) {
						res = res.data
						_this.$toast(res.msg)
						if (1 == res.code) {
							_this.showAddressList = false;
							_this.showAddressDetail = false
							_this.getDefaultAddress();
							_this.getAddressList();
						}
					})

				} else { //编辑
					_this.$http.put('address/' + content.id, {
						content
					}).then(function(res) {
						res = res.data
						_this.$toast(res.msg);
						if (1 == res.code) {
							_this.showAddressDetail = false
							_this.getDefaultAddress();
							_this.getAddressList();
						}
					})
				}
			},
			onChange(index) {
				this.lastPrice = this.product.market_price * 100
				this.showList = false;
				this.chosenCoupon = index;
				let chosen = this.coupons[index]
				if (undefined != chosen) {
					this.coupon_id = chosen.id
					let lastPrice = this.lastPrice - chosen.value
					if (lastPrice <= 0) {
						this.lastPrice = 0
					} else {
						this.lastPrice = lastPrice
					}
				} else {
					this.coupon_id = 0
					let lastPrice = this.product.market_price * 100
					if (lastPrice <= 0) {
						this.lastPrice = 0
					} else {
						this.lastPrice = lastPrice
					}
				}

			},
			onExchange(code) {
				const _this = this
				_this.$http.post('index/checkCode', {
					code
				}).then(function(res) {
					res = res.data
					if (1 == res.code) {
						let discount = res.data.discount
						_this.coupons.push(discount);
					}
				})
			},
			onChangeDetail() {

			},
			onSelect(item, index) {
				this.address = this.list[index]
				this.showAddressDetail = false
				this.showAddressList = false
			},
		}
	}
</script>

<style>
	.van-loading {
		display: inline-block;
		margin: 5px 0 5px 20px;
	}

	.van-loading--white {
		padding: 10px;
		border-radius: 3px;
		background-color: rgba(0, 0, 0, .5);
	}
</style>
