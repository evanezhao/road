<template>
	<view class="content uni-flex uni-column" style="width: 100%; height: 98%; overflow-y: auto;">
		<view class="uni-flex uni-row fzfff uni-common-pa" style="background-color: #62ABF8;border-radius: 10upx;">
			<view class="uni-flex uni-column" style="width: 50%;">
				<view class="uni-flex uni-row">
					<view class="uni-flex uni-column" style="width: 50%;">
						<text class="uni-h3 fzfff">{{weather.city}}</text>
					</view>
					<view class="uni-flex uni-column uni-common-pb" style="width: 50%;align-self:flex-end; text-align: left;">
						<text class="uni-h6 fzfff">{{weather.province}}</text>
					</view>
				</view>
				<view class="uni-flex uni-row uni-common-pl">
					<text class="uni-h6 fzfff" v-html="dateTime"></text>
				</view>
			</view>
			<view class="uni-flex uni-column" style="width: 50%;">
				<view class="uni-flex uni-row">
					<text class="title fzfff" style="width: 50%;">{{weather.weather}}</text>
					<text class="title fzfff">{{weather.temperature}}°</text>
				</view>
				<view class="uni-flex uni-row">
					<text class="title fzfff" style="width: 50%;">{{weather.winddirection}}</text>
					<text class="title fzfff">{{weather.windpower}}</text>
				</view>
			</view>
		</view>
		<view class="uni-margin-wrap uni-flex uni-row uni-h6 uni-color-797" style="text-align:left;text-indent:10upx">
			舒达成立于2015年，目前已经发展成为长沙最大的专业汽车救援机构，可向广大的汽车驾驶员提供全年365天，全天候24小时，全年无休的专业汽车救援服务
		</view>
		<navigator v-show="user.islogin && !!orders" v-for="order in orders" :key="order.id" class="uni-margin-wrap uni-flex uni-row uni-card-shadow"
		 :url="(viewUrlList[user.rule]||viewUrlList[1])+order.id" style="background-color: #FFFFFF;padding:0 30upx;border-radius:5px;">
			<view class="uni-flex uni-column" style="width: 100%;">
				<view class="uni-flex uni-row" style="height: 100upx;">
					<view class="uni-flex uni-column" style="width: 100%;align-self: center;  justify-content: flex-start;">
						<text class="title uni-h3" style="text-align: left;">{{order.cartNo||'暂无车牌信息'}}</text>
					</view>
					<view class="uni-flex uni-column" style="justify-content: flex-start;align-self: center; width: 280upx;">
						<text class="uni-h6" :style="'color:#'+order.color">{{order.statusText}}</text>
					</view>
					<view v-if="order.status>1" class="uni-flex uni-column uni-icon uni-icon-navigate" style="justify-content: flex-end;align-self: center; color: #007AFF;"
					 @click.stop="navPosition">
					</view>
				</view>
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="uni-flex uni-column uni-h6" style="justify-content: flex-start;align-self: center;width: 70%;text-align: left;">
						事故地：{{order.fromAddress}} <br />
						目的地：{{order.toAddress}}
					</view>
					<view class="uni-flex uni-column" style="justify-content: flex-end;width: 30%;">
						<button type="default" class="uni-text-small" style="width: 120upx;height: 60upx;margin-bottom: 30upx;;">详情</button>
					</view>
				</view>
			</view>
		</navigator>
		<navigator v-if="user.rule === 0" :url="btnOpt.url" hover-class="navigator-hover" :open-type="btnOpt.opentype" class="uni-margin-wrap uni-flex uni-row uni-center">
			<button type="primary" style="width: 100%;">请求救援</button>
		</navigator>
		<navigator v-if="user.rule === 2 || user.rule === 3" :url="btnOpt.url" hover-class="navigator-hover" :open-type="btnOpt.opentype"
		 class="uni-margin-wrap uni-flex uni-row uni-center">
			<button type="primary" style="width: 100%;">派单</button>
		</navigator>
	</view>
</template>

<script>
	import amap from '@/common/amap-wx.js';
	import _reqs from '@/common/req.js';
	import uniIcon from '@/components/uni-icon/uni-icon.vue';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';

	export default {
		components: {
			uniIcon
		},
		computed: {
			...mapState(['user', 'GAODE_KEY', 'WEEK_ENUM', 'orderStatus', 'orderColor'])
		},
		data() {
			return {
				title: '客户主页',
				errorInfo: '暂时无法获取天气数据，请检查你的网络',
				dateTime: '',
				viewUrlList: {
					"2": '/pages/servicer/view?id=',
					"1": '/pages/driver/view?id=',
					"0": '/pages/customer/view?id='
				},
				btnOpt: {
					url: "/pages/customer/my/my?s=login",
					opentype: "switchTab"
				},
				createUrl: '/pages/customer/create',
				weather: {
					province: '--', //省
					city: '--', //城市
					reporttime: '--', //报告时间
					humidity: 0, //湿度
					temperature: '--', //温度
					weather: '--', //天气
					winddirection: '--', //风向
					windpower: '--' //风力
				},
				orders: []
			}
		},
		onLoad() {
			let amapPlugin = new amap.AMapWX({
					key: this.GAODE_KEY
				}),
				self = this,
				now = new Date();
			self.dateTime = [now.getMonth() + 1, '月', now.getDate(), '日', '&nbsp;', self.WEEK_ENUM[now.getDay()]].join('');

			self.$permission.weixinCheck('userLocation').then(function() {
				self.getWeather(amapPlugin);
			}).catch(function(err) {
				uni.showToast({
					title: err,
					icon: "none"
				});
			});
		},
		onShow() {
			const self = this;
			if (self.user.islogin) {
				self.btnOpt.url = self.user.rule === 2 || self.user.rule === 3 ? "/pages/servicer/create" :
					"/pages/customer/create";
				self.btnOpt.opentype = "navigate";
				self.$req({
					url: self.$apis.order.getMyOrder,
					method: 'GET',
					data: {
						type: '0'
					},
					success(res) {
						if (res.data.status === 200) {
							let needCollectPos = false;
							self.orders = res.data.data;
							self.orders.forEach((order) => {
								order.statusText = self.orderStatus[order.status];
								order.color = self.orderColor[order.status];
								if (
									(self.user.rule === 0 && order.status <= 1) ||
									(self.user.rule === 1 && order.status < 4)
								) {
									//用户角色为客户时，如果有订单状态为 0初始， 1施救出车中
									//用户解决为司机时，如果有订单状态为 0初始， 1施救出车中，2现场施救中，3送达途中
									//以上2种情况采集用户位置数据
									needCollectPos = true;
								}
							});
							if (needCollectPos) {
								//self.$localPos.startCollectPosInfo(self);
							}
						}
					},
					fail(err) {
						console.log(`获取我的订单失败：${err.errMsg}`);
					}
				});

				/* uni.setTabBarBadge({
					index: 0,
					text: '3'
				}); */
			} else {
				this.createUrl = '/pages/customer/my/my';
			}
		},
		methods: {
			getWeather(amapPlugin) {
				var self = this;
				amapPlugin.getWeather({
					type: 'live',
					success: function(data) {
						for (let key in self.weather) {
							self.weather[key] = data[key] ? data[key].data : '';
						}
					},
					fail: function(info) {
						console.log(info);
					}
				});
			},
			navDetail: () => {
				uni.navigateTo({
					url: '/pages/customer/create'
				});
			},
			navPosition: () => {
				uni.navigateTo({
					url: '/pages/customer/choosePos/viewPos'
				});
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400 upx;
	}

	.logo {
		height: 200 upx;
		width: 200 upx;
		margin-top: 200 upx;
	}

	.title {
		font-size: 36 upx;
		color: #8f8f94;
	}

	.fzfff {
		color: #fff;
	}
</style>
