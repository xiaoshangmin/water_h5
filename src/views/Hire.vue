<template>
	<div style="background: #fafafa;">
		<van-nav-bar title="我的购买" style="background-color: #f7f7f7;" left-arrow @click-left="onClickLeft" />

		<van-panel :title="item.order_title" :status="item.status_txt" v-for="(item,index) in list" :key="index">
			<van-card>
				<div slot="thumb">
					<img :src="item.goods_image" alt="">
				</div>
				<span slot="desc">
					订单编号：{{item.order_sn}}
					<p>下单时间：{{item.createtime}}</p>
					<p>地址：{{item.address}}</p>
				</span>
			</van-card>
			<div slot="footer">
				实付款:￥<span style="font-weight: 600;">{{item.actual_payment}}</span>
			</div>
		</van-panel>
	</div>
</template>

<script>
	export default {
		mounted() {
			const _this = this
			_this.$http.get('order').then(function(res) {
				_this.list = res.data.data
			});
		},
		data() {
			return {
				imageURL: 'http://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
				list: [],
			};
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1)
			},
		}
	};
</script>

<style>
	.van-panel{
		margin-bottom: 10px;
	}
	.van-panel__footer{
		text-align: right;
	}
</style>
