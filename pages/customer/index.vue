<template>
	<view class="content uni-flex uni-column" style="width: 100%; height: 98%; overflow-y: auto;">
		<view class="uni-margin-wrap uni-flex uni-row fzfff uni-common-pa" style="background-color: #62ABF8;border-radius: 10upx;">
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
					<text class="title fzfff" style="width: 50%;">{{weather.winddirection}}风</text>
					<text class="title fzfff">{{weather.windpower}}级</text>
				</view>
			</view>
		</view>
		<view class="uni-margin-wrap uni-flex uni-row uni-h6 uni-color-797" style="text-align:left;text-indent:10upx">
			舒达成立于2015年，目前已经发展成为长沙最大的专业汽车救援机构，可向广大的汽车驾驶员提供全年365天，全天候24小时，全年无休的专业汽车救援服务
		</view>
		<navigator v-show="!!orders" v-for="order in orders" :key="order.id" class="uni-margin-wrap uni-flex uni-row" :url="'/pages/customer/view?id='+order.id"
		 style="border: solid 1upx #96d9ec;background-color: #FFFFFF;padding:0 30upx;border-radius:5px;">
			<view class="uni-flex uni-column" style="width: 100%;">
				<view class="uni-flex uni-row" style="height: 100upx;">
					<view class="uni-flex uni-column" style="width: 100%;align-self: center;  justify-content: flex-start;">
						<text class="title uni-h3" style="text-align: left;">{{order.cartNo}}</text>
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
		<navigator url="/pages/customer/create" hover-class="navigator-hover" class="uni-margin-wrap uni-flex uni-row uni-center">
			<button type="primary" style="width: 100%;">请求救援</button>
		</navigator>

	</view>
</template>

<script>
	import amap from '@/common/amap-wx.js';
	import uniIcon from '@/components/uni-icon/uni-icon.vue';
	import {
		mapState,
		mapMutations
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
				weather: {
					province: '', //省
					city: '', //城市
					reporttime: '', //报告时间
					humidity: 0, //湿度
					temperature: '', //温度
					weather: '', //天气
					winddirection: '', //风向
					windpower: '' //风力
				},
				orders: [{
						id: 'a',
						cartNo: '湘A-111111',
						status: 2,
						statusText: '',
						fromAddress: '北京海淀区沟沟',
						toAddress: '北京昌平区沟沟'
					},
					{
						id: 'b',
						cartNo: '湘A-222222',
						status: 0,
						statusText: '',
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2'
					}
				]
			}
		},
		onLoad() {
			let amapPlugin = new amap.AMapWX({
					key: this.GAODE_KEY
				}),
				self = this,
				now = new Date();
			self.dateTime = [now.getMonth() + 1, '月', now.getDate(), '日', '&nbsp;', this.WEEK_ENUM[now.getDay()]].join('');
			this.orders.forEach((order) => {
				order.statusText = this.orderStatus[order.status];
				order.color = this.orderColor[order.status];
			});
			/* amapPlugin.getWeather({
				type: 'live',
				success: function(data) { */
			let weather = {
				"city": {
					"text": "城市",
					"data": "海淀区"
				},
				"weather": {
					"text": "天气",
					"data": "晴"
				},
				"temperature": {
					"text": "温度",
					"data": "23"
				},
				"winddirection": {
					"text": "风向",
					"data": "西南风"
				},
				"windpower": {
					"text": "风力",
					"data": "≤3级"
				},
				"humidity": {
					"text": "湿度",
					"data": "64%"
				},
				"liveData": {
					"province": "北京",
					"city": "海淀区",
					"adcode": "110108",
					"weather": "晴",
					"temperature": "23",
					"winddirection": "西南",
					"windpower": "≤3",
					"humidity": "64",
					"reporttime": "2019-04-23 20:21:49"
				}
			};
			if (weather) {
				self.weather.province = weather.liveData.province;
				self.weather.city = weather.liveData.city;
				self.weather.reporttime = weather.liveData.reporttime;
				self.weather.humidity = weather.liveData.humidity;
				self.weather.temperature = weather.liveData.temperature;
				self.weather.weather = weather.liveData.weather;
				self.weather.winddirection = weather.liveData.winddirection;
				self.weather.windpower = weather.liveData.windpower;
			}
			/* },
				fail: function(info) {
					console.log(info);
				} 
			});*/
			uni.setTabBarBadge({
				index: 0,
				text: '3'
			});
		},
		methods: {
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
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	.fzfff {
		color: #fff;
	}
</style>
