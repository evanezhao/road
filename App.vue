<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	export default {
		computed: {
			...mapState(['user', 'GAODE_KEY', 'WEEK_ENUM', 'orderStatus', 'orderColor'])
		},
		onLaunch: function() {
			console.log('App Launch');
			const self = this;

			if (self.user.islogin) {
				//#ifdef MP-WEIXIN
				wx.checkSession({
					success() {
						//session_key 未过期，并且在本生命周期一直有效
						self.updateUserToken(self.user.wxCode);
					},
					fail() {
						//session_key 已经失效，需要重新执行登录流程
						//重启微信登录
						wx.login({
							success: function(loginRes) {
								console.log(loginRes);

								if (loginRes.code) {
									self.setWXCode(loginRes.code);
									self.updateUserToken(loginRes.code);
								} else {
									let errMsg = `登录失败！${loginRes.errMsg}`;
									uni.showToast({
										title: errMsg
									});
								}
							},
							fail: function(err) {
								console.log(err);
							}
						});
					}
				});
				//#endif

			} else {
				//#ifdef MP-WEIXIN
				wx.login({
					success: function(loginRes) {
						console.log(loginRes);

						if (loginRes.code) {
							self.setWXCode(loginRes.code);
						} else {
							let errMsg = `登录失败！${loginRes.errMsg}`;
							uni.showToast({
								icon: 'none',
								title: errMsg
							});
						}
					},
					fail: function(err) {
						console.log(err);
					}
				});
				//#endif
			}

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapActions(['logout', 'login', 'setWXCode']),
			async updateUserToken(code) {
				let [err, res] = await uni.request({
					url: this.$apis.user.updateToken,
					method: 'POST',
					header: {
						token: this.user.token
					},
					data: {
						code: this.user.wxCode
					}
				});
				if (res && res.data && res.data.status === 200) {
					this.login(res.data.data);
				} else {
					this.logout();
					uni.showToast({
						icon: 'none',
						title: err && err.errMsg || res.data.message
					});
				}
			}
		}
	}
</script>
<style>
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #F4F5F6;
		height: 100%;
		font-size: 28upx;
		line-height: 1.8;
	}

	.uni-header-logo {
		padding: 30upx;
		text-align: center;
		margin-top: 10upx;
	}

	.uni-header-logo image {
		width: 140upx;
		height: 140upx;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-card-shadow {
		box-shadow: 0 0 30upx #9c9c9c;
	}
</style>
