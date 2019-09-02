<template>
	<div>
		<div style="position: relative;">
			<img class="user-poster" src="../assets/water.png">
		</div>
		<van-row class="user-avatar">
			<van-col span="24">
				<img :src="avatar">
			</van-col>
		</van-row>
		<van-row class="user-links">
			<van-col span="24">
				{{nickname}}
			</van-col>
		</van-row>
		<van-cell-group>
			<!-- <van-cell icon="exchange" title="我的租赁" is-link to="/user/hire" /> -->
			<van-cell icon="gold-coin" title="我的购买" is-link to="/user/hire" />
			<van-cell icon="setting" title="联系售后" is-link to="/user/service" />
		</van-cell-group>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				avatar: "",
				nickname: "",
			}
		},
		created() {
			this.$emit('changeTab', 4)
			let _this = this
			this.$http.get('user').then(function(res){
				res = res.data
				if(1==res.code){
					_this.avatar = res.data.avatar
					_this.nickname = res.data.nickname
				}
			})
		}
	};
</script>

<style lang="less">
	.user {
		&-poster {
			width: 100%;
			display: block;
			overflow: hidden
		}

		&-group {
			margin-bottom: 15px;
		}

		&-links {
			width: 100%;
			padding: 15px 0;
			font-size: 12px;
			text-align: center;
			position: absolute;
			top: 26%;
			color: white;
			font-size: 25px;

			.van-icon {
				display: block;
				font-size: 24px;
			}
		}

		&-avatar {
			width: 100%;
			position: absolute;
			text-align: center;
			top: 5%;
		}

		&-avatar img {
			border-radius: 50%;
		}
	}
</style>
