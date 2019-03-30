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
				<van-cell :icon="alipay_icon" clickable @click="radio = '2'">
					<template slot="title">
						<span>支付宝支付</span>
						<van-tag type="danger">推荐</van-tag>
					</template>
					<van-radio name="2" />
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
				wxpay_icon: "data:image/jpeg;base64,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",
				alipay_icon: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/7AARRHVja3kAAQAEAAAASwAA/+EDQGh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4NCgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzEzRjhCRUVFNTU3MTFFN0JFRjVFRkM4NjZBNTlCQTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzEzRjhCRUZFNTU3MTFFN0JFRjVFRkM4NjZBNTlCQTgiPg0KCQkJPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzEzRjhCRUNFNTU3MTFFN0JFRjVFRkM4NjZBNTlCQTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzEzRjhCRURFNTU3MTFFN0JFRjVFRkM4NjZBNTlCQTgiLz4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJPC9yZGY6UkRGPg0KPC94OnhtcG1ldGE+DQo8P3hwYWNrZXQg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",
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
					_this.$http.post('order/alipay', {
						code: _this.code,
						aid: _this.address.id,
						remark: _this.remark,
						gid: _this.$route.query.goods_id,
						coupon_id: _this.coupon_id
					}).then(function(res) {
						var data = res.data
						let c = _AP.ali.pay(data.data)
						location.href = "https://wowyou.cc/mp/pay.html?goto=" + c
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
