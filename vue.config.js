module.exports = {
		productionSourceMap: false,
		publicPath: '/mp',
		devServer: {
			proxy: {
				'/api': {
					target: 'https://wowyou.cc',
					ws: true,
					changeOrigin: true
				}
			}
		}
}