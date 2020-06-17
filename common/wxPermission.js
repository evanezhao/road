/**	微信权限授权
 * @param {String} scope	微信权限scope
 *  "scope.userInfo": FALSE,				//用户信息
	"scope.userLocation": FALSE,			//地理位置
	"scope.userLocationBackground": FALSE,	//后台定位
	"scope.address": FALSE,					//通讯地址
	"scope.invoiceTitle": FALSE,			//发票抬头
	
	"scope.invoice": FALSE,					//获取发票
	"scope.werun": FALSE,					//微信运动步数
	"scope.record": FALSE,					//录音功能
	"scope.writePhotosAlbum": FALSE,		//保存到相册
	"scope.camera": FALSE					//摄像头
 */
const authTips = {
	"scope.userInfo": "您的个人信息将用于快速登录/注册",
	"scope.userLocation": "您的位置信息将用于当地天气预报及地图展示，请在接下来的设置中选择\"位置信息\"进行设置",
	"scope.userLocationBackground": "你的实时位置信息将用于车辆调度，请在接下来的设置中选择\"位置信息\" -> \"使用小程序期间和离开小程序后\"",
	"scope.address": "您的收货地址信息将用于发票寄送",
	"scope.invoiceTitle": "您发票抬头用于拖车费用的发票开具",
	"scope.writePhotosAlbum": "现场事故照片需要保存到相册，请在接下来的设置中授权使用",
	"scope.camera": "需要使用相机拍摄事故现场照片"
};

function checkPermission(scope) {
	const self = this,
		scopeStr = `scope.${scope}`;
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success(res) {
				if (res.authSetting[scopeStr]) {
					resolve();
				} else {
					wx.authorize({
						scope: scopeStr,
						success: resolve,
						fail: function(err) {
							if (scope === 'userLocation' || scope === 'userLocationBackground') {
								//用户拒绝授权后，再次请求授权将打开设置页面，引导用户自行开
								uni.showModal({
									showCancel: false,
									title: "授权申请",
									content: authTips[scopeStr],
									success() {
										wx.openSetting({
											success(result) {
												!!result.authSetting[scopeStr] ? resolve() : reject(`权限开启失败，相关功能将无法正常使用`);
											},
											fail: reject
										});
									}
								});
							} else {
								reject(err);
							}
						}
					});
				}
			},
			fail: reject
		});
	});
}

export default checkPermission;
