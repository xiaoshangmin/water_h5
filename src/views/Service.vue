<template>
	<div>
		<van-nav-bar title="售后服务" style="background-color: #f7f7f7;" left-arrow @click-left="onClickLeft" />
		<div class="list">
			<van-row class="linkman" v-for="(item,index) in list" :key="index">
				<van-col span="6" class="avatar">
					<img :src="item.avatar" alt="" style="width: 100%;">
				</van-col>
				<van-col span="18">
					<van-row>
						<van-col span="16" class="link">
							{{item.username}}
						</van-col>
						<van-col span="8" class="link">
							<van-icon name="chat" size="30px" @click="doCopy(item.wechat)" />
						</van-col>
					</van-row>
					<van-row>
						<van-col span="16" class="link">
							{{item.address}}
						</van-col>
						<van-col span="8" class="link">
							<a :href="'tel:'+item.phone">
								<van-icon name="phone" size="30px" /></a>
						</van-col>
					</van-row>
				</van-col>
			</van-row>
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {
			const _this = this
			_this.$http.post('index/service').then(function(res) {
				res = res.data
				_this.list = res.data
			});
		},
		data() {
			return {
				imageURL: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep1LhrnIDibziczPaDoSzkg2ia627WaLm4FLT0uPu6lXMqQycOVGVrsjTuTC5xd7ahXuj1dvu5mdjKTg/132',
				list: []
			};
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1)
			},
			doCopy: function(message) {
				const _this = this;
				this.$copyText(message).then(function() {
					_this.$toast('复制成功');
				}, function() {
					alert('Can not copy')
				})
			}
		}
	}
</script>

<style>
	.avatar img {
		border-radius: 50%;
	}

	.linkman {
		background-color: white;
		border-bottom: 3px solid #eee;
	}

	.link {
		display: flex;
		height: 50px;
		align-items: center;
		justify-content: center;
	}

	.list {
		padding-bottom: 50px;
	}
</style>
