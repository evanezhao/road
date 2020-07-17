<template>
	<view class="uni-flex uni-column">
		<view class="uni-flex uni-row" style="background-image: linear-gradient(to bottom, #99cccc 20%,#7171b7 80%);color: #fff;height: 200upx;padding-top: 40upx;">
			<view class="uni-flex uni-column" style="width: 40%;align-items: center;justify-content: flex-start;">
				<view class="uni-flex uni-row" style="justify-content: center;border-radius:60upx; background-color: #FFFFFF;">
					<uni-icon v-if="!user.islogin" type="person-filled" size="60" color="#8f8f94"></uni-icon>
					<image v-if="user.islogin" style="width: 60px;height: 60px;" :src="user.headImg"></image>
				</view>

			</view>
			<view v-if="user.islogin" class="uni-flex uni-column" style="width: 60%; ">
				<view class="uni-flex uni-row title uni-h3">
					{{user.nickName}}
				</view>
				<view v-if="!user.tel" class="uni-flex uni-row">
					<button type="primary" size="mini" open-type="getPhoneNumber" lang="zh_CN" @getphonenumber="bindWXTel">绑定微信手机号</button>
				</view>
				<view class="uni-flex uni-row">
					{{user.tel || ''}}
				</view>
			</view>
			<view v-if="!user.islogin" class="uni-flex uni-column" style="width: 60%; ">
				<button type="primary" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="showUserInfo">微信登录</button>
			</view>
		</view>
		<view class="uni-flex uni-row uni-common-mt">
			<uni-list style="width: 100%;">
				<uni-list-item @click="toOrderList" title="我的记录" thumb="/static/order.png" showArrow="true" :showBadge="newOrderNum>0"
				 :badgeText="newOrderNum"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	import uniIcon from '@/components/uni-icon/uni-icon.vue';
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list/uni-list-item.vue'

	export default {
		components: {
			uniIcon,
			uniList,
			uniListItem
		},
		computed: {
			...mapState(['user'])
		},
		data() {
			return {
				wxUserInfo: {},
				newOrderNum: '1'
			}
		},
		methods: {
			...mapActions(['login', 'setWXTel', 'setWXCode']),
			toOrderList() {
				uni.navigateTo({
					url: "/pages/customer/my/orderList"
				});
			},
			tocard() {
				uni.navigateTo({
					url: "/pages/serachCar/serachCar"
				});
			},
			showUserInfo(e) {
				const wxUserInfo = e.detail.userInfo;
				const params = {
					code: this.user.wxCode,
					nickName: wxUserInfo.nickName,
					avatarUrl: wxUserInfo.avatarUrl,
					gender: wxUserInfo.gender,
					country: wxUserInfo.country,
					province: wxUserInfo.province,
					city: wxUserInfo.city,
					language: wxUserInfo.language
				};

				this.wxUserInfo = wxUserInfo;
				this.bindWXUser.call(this, params);

			},
			bindWXUser(params) {
				const self = this;
				self.$req({
					url: self.$apis.user.bindwx,
					method: 'POST',
					data: params,
					success(res) {
						const resData = res.data;
						console.log(res);
						if (resData.status !== 200) {
							if (resData.data.code === 'WXCODEERR') {
								wx.login({
									success: function(res) {
										self.setWXCode(res.code);
										params.code = res.code;
										self.bindWXUser.call(this, params);
									},
									fail: function(err) {
										console.log(err);
									}
								});

							}
							uni.showToast({
								title: "系统错误:" + resData.message,
								icon: 'none'
							});
							return;
						}
						self.login({
							rule: resData.data.rule,
							token: resData.data.token,
							tel: resData.data.tel,
							nickName: self.wxUserInfo.nickName,
							headImg: self.wxUserInfo.avatarUrl.replace('/132', '/64')
						});
					}
				});
			},
			bindWXTel(e) {
				const telData = e.detail;
				const self = this;
				const bindFun = (code)=>{
					self.$req({
						url: self.$apis.user.bindtel,
						method: 'POST',
						data: {						
							encryptedData: telData.encryptedData,
							code,
							iv: telData.iv
						},
						success(res) {
							console.log(res);
							self.setWXTel(res.data.data.tel);
						}
					});
				}
				console.log('wxUserTelInfo', telData);
				//#ifdef MP-WEIXIN
				//重启微信登录
				wx.login({
					success: function(loginRes) {
						console.log(loginRes);

						if (loginRes.code) {
							self.setWXCode(loginRes.code);	
							bindFun(loginRes.code);
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
				//#endif
						
			}
		}
	}
</script>

<style>

</style>
