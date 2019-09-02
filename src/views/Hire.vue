<template>
	<div style="background: #fafafa;">
		<van-nav-bar title="我的购买" style="background-color: #f7f7f7;" left-arrow @click-left="onClickLeft" />

		<van-panel :title="item.order_title" :status="item.status_txt" v-for="(item,index) in list" :key="index">
			<van-card :thumb="item.goods_image">
				<span slot="desc">
					订单编号：{{item.order_sn}}
					<p>下单时间：{{item.createtime}}</p>
					<p>地址：{{item.address}}</p>
				</span>
			</van-card>
			<div slot="footer">
				<div>
					实付款:￥<span style="font-weight: 600;">{{item.actual_payment}}</span>
				</div>

				<van-button v-if="!item.comment" size="small" @click="comment(item.order_goods[0].goods_id,item.order_sn)">评价</van-button>
			</div>
		</van-panel>
		<van-popup v-model="show" position="bottom" :style="{ height: '90%' }">
			<van-row>
				<van-cell-group>
					<van-field v-model="message" type="textarea" placeholder="请输入评价" size="large" rows="3" autosize clearable />
				</van-cell-group>
			</van-row>
			<van-row>
				<van-uploader v-model="fileList" :max-count="9" :after-read="afterRead" @delete="del" />
			</van-row>
			<van-sticky>
				<van-button type="primary" size="large" @click="send()">发布</van-button>
			</van-sticky>
		</van-popup>

	</div>
</template>

<script>
	import {
		Toast
	} from 'vant';
	export default {
		data() {
			return {
				imageURL: 'http://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
				list: [],
				show: false,
				fileList: [],
				message: '',
				images: [],
				formdata: '',
				goods_id: 0,
				order_sn: ''
			};
		},
		created() {
			const _this = this
			this.formdata = new FormData();
			_this.$http.get('order').then(function(res) {
				_this.list = res.data.data
			});
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			},
			comment(gid, order_sn) {
				this.goods_id = gid;
				this.order_sn = order_sn
				this.show = true;
			},
			del(file) {
				let index = file.file.name
				delete this.images[index]
				this.formdata.delete("file[]");
				for (let index in this.images) {
					this.formdata.append("file[]", this.images[index])
				}
			},
			afterRead(file, detail) {
				var image = file.file
				this.images[image.name] = image;
				this.formdata.delete("file[]");
				for (let index in this.images) {
					this.formdata.append("file[]", this.images[index])
				}
			},

			send() {
				if (this.message == '') {
					this.$toast('请输入评价内容！')
					return;
				}
				Toast.loading({
					duration: 0, // 持续展示 toast
					mask: true,
					forbidClick: true, // 禁用背景点击
					message: '发布中...'
				});
				this.formdata.set("content", this.message);
				this.formdata.set("goods_id", this.goods_id);
				this.formdata.set("order_sn", this.order_sn);
				this.$http.post('comments', this.formdata).then(res => {
					var data = res.data
					Toast.clear();
					this.$toast(data.msg)
					if (data.code == 1) {
						window.location.reload()
					}
					return
				})
			}
		}
	};
</script>

<style>
	.van-panel {
		margin-bottom: 10px;
	}

	.van-panel__footer>div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.upload-img-5 {
		margin: 5px 0 90px 0;
	}

	.upload-img-1 {
		margin: 5px 0 15px 0;
	}

	.uploadimg {
		width: 80px;
		height: 80px;
		background-color: #fff;
		border: 1px dashed #e5e5e5;
	}

	.van-button {}
</style>
