/**
 * 实时采集用户当前位置
 */
const local = {
	data: [], //位置数据
	reportTime: new Date().getTime(), //上报位置的时间
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
							pos = {
								time: new Date().getTime(),
								longitude: res.longitude, //经度
								latitude: res.latitude //纬度
							},
							prevPos = posLen > 0 ? self.data[posLen - 1] : null;

						if (prevPos) {
							if (
								(prevPos.longitude !== pos.longitude || prevPos.latitude !== pos.latitude) //当前位置不同于上一个位置
								&&
								(pos.time - prevPos.time) > 5000 //5秒采集一次位置
							) {
								self.data.push(pos);
								console.log('location change', pos);
							}
						} else {
							self.data.push(pos);
							console.log('location change', pos);
						}
						//todo:7秒上报一次数据 
						if (self.data.length && pos.time - self.reportTime > 7000 && app.user.islogin) {
							app.$req({
								url: app.$apis.user.reportPostion,
								method: 'POST',
								data: {
									pos: self.data.map(function(item, index) {
										return `${item.time}|${item.latitude}|${item.longitude}`;
									}).join(',')
								}
							});
							self.data.length = 0;
						}
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
	endCollectPosInfo: function() {
		this.status = 0;
		// #ifdef MP-WEIXIN
		wx.stopLocationUpdate();
		// #endif
	}
}
export default local;
