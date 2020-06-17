/**
 * 实时采集用户当前位置
 */
const local = {
	data: [], //位置数据
	status: 0, //0停止采集 1正在采集
	/**
	 * 开始采集用户实时位置信息
	 * @param {Object} app Vue实例
	 */
	startCollectPosInfo: function(app) {
		const self = this;
		if (self.status === 1) {
			return;
		}
		app.$permission.weixinCheck('userLocationBackground').then(function() {
			let startTime = new Date();
			//#ifdef MP-WEIXIN
			wx.startLocationUpdateBackground({
				success: function() {
					self.status = 1;
					wx.onLocationChange(function(res) {
						let posLen = self.data.length,
							now = new Date(),
							longitude = res.longitude, //经度
							latitude = res.latitude; //纬度
						if (posLen > 0) {
							if (self.data[posLen - 1].longitude !== longitude || self.data[posLen - 1].latitude !== latitude) {
								self.data.push({
									now,
									longitude,
									latitude
								});
							}
						} else {
							self.data.push({
								now,
								longitude,
								latitude
							});
						}
						console.log('location change', self.data);

					});
				},
				fail: function(res) {
					console.log('location auth fail:', res);
				}
			});
			//#endif


		}).catch(function(err) {
			uni.showToast({
				title: err,
				icon: "none"
			});
		});
	},
	/**
	 * 终止采集用户实时位置
	 */
	endCollectPosInfo : function() {
		this.status = 0;
		// #ifdef MP-WEIXIN
		wx.stopLocationUpdate();
		// #endif
	}
}
