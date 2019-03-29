<template>
	<div style="background-color: #eee;">
		<div class="van_cert">
			<img :src="item" v-for="(item,index) in images" :key="index" @click="showImagePreview(index)" width="100%">
		</div>
	</div>
</template>

<script>
	import {ImagePreview} from 'vant'
	export default {
		data() {
			return {
				images: []
			}
		},
		mounted() {
			this.$emit('changeTab', 3)
			this.getCert()
		},
		methods: {
			getCert() {
				const _this = this
				_this.$http.get('index/cert').then(function(res) {
					res = res.data
					_this.images = res.data
				})
			},
			showImagePreview(position) {
				let images = this.images
				ImagePreview({
					images, 
					startPosition: typeof position === 'number' ? position : 0
				});
			}
		}
	}
</script>

<style scoped>
	.van_cert {
		margin-bottom: 50px;
		padding: 15px;
	}

	img {
		width: 100%;
		/* height: 250px; */
		padding: 5px;
		margin: 10px 0 0;
		background-color: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		background-repeat: no-repeat;
		box-sizing: border-box;
	}
</style>
