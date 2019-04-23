<template>
	<view class="content" style="height: 100%; background: url(../../static/bg1.png) no-repeat fixed;background-size: cover;">
		<view class="uni-flex uni-row" style="padding-top: 30upx;">
			<view class="uni-flex uni-column" style="width: 50%;">
				<view class="uni-flex uni-row">
					<view class="uni-flex uni-column" style="width: 50%;">
						<text class="uni-h3">{{weather.city}}</text>
					</view>
					<view class="uni-flex uni-column uni-common-pb" style="width: 50%;align-self:flex-end; text-align: left;">
						<text class="uni-h6">{{weather.province}}</text>
					</view>
				</view>
				<view class="uni-flex uni-row uni-common-pl">
					<text class="uni-h6" v-html="dateTime"></text>
				</view>
			</view>
			<view class="uni-flex uni-column" style="width: 50%;">
				<view class="uni-flex uni-row">
					<text class="title" style="width: 50%;">{{weather.weather}}</text>
					<text class="title">{{weather.temperature}}°</text>
				</view>
				<view class="uni-flex uni-row">
					<text class="title" style="width: 50%;">{{weather.winddirection}}风</text>
					<text class="title">{{weather.windpower}}级</text>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row" style="margin-top: 50upx;">
			<text class="title uni-h4 uni-center" style="width: 100%;">安全，是回家最近的路</text>
		</view>
		<view class="uni-flex uni-row">
			<text class="uni-h6 uni-common-pl uni-common-pr" style="font-style: italic; text-align:left;text-indent:10upx">"Every
				human being has a basic instinct: to help each other
				out. If a hiker gets lost in the mountains, people will coordinate a search. If a train crashes, people will line
				up to give blood. If an earthquake levels a city, people all over the world will send emergency supplies. This is
				so fundamentally human that it's found in every culture without exception. Yes, there are assholes who just don't
				care, but they're massively outnumbered by the people who do. "</text>
		</view>
		<view class="uni-flex uni-row uni-center" style="margin-top: 40upx;">
			<view style="width: 100upx;height: 100upx;border-radius: 50upx;background-color: #09BB07;margin: 0 auto;line-height: 100upx;font-weight: border;color: #fff;">求援</view>
		</view>
		<view class="uni-flex uni-row uni-common-pl uni-common-pr uni-common-pb" style="align-self: flex-end;margin-top: 50upx;border: solid 1upx #96d9ec;background-color: #FFFFFF;">
			<view class="uni-flex uni-column" style="width: 100%;">
				<view class="uni-flex uni-row" style="height: 100upx;">
					<view class="uni-flex uni-column" style="width: 100%;align-self: center;  justify-content: flex-start;">
						<text class="title uni-h3" style="text-align: left;">湘H-123456</text>
					</view>
					<view class="uni-flex uni-column" style="justify-content: flex-start;align-self: center; width: 280upx;">
						<text class="uni-h6">司机正在赶来</text>
					</view>
					<view class="uni-flex uni-column" style="justify-content: flex-end;align-self: center;" @click="navPosition">
						<image src="../../static/pos_start.png" mode="aspectFit" style="margin: 0 auto;width: 80upx;height: 80upx;"></image>
					</view>
				</view>
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="uni-flex uni-column uni-h6" style="justify-content: flex-start;align-self: center;width: 70%;text-align: left;">
						去往：长沙长沙长沙长沙长沙长沙
					</view>
					<view class="uni-flex uni-column" style="justify-content: flex-end;width: 30%;">
						<button @click="navDetail" type="primary" class="uni-text-small" plain="true" style="width: 120upx;height: 60upx;font-weight: bold;">详情</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import amap from '@/common/amap-wx.js';
	import config from '@/common/config.js';
	export default {
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
				}
			}
		},
		onLoad() {
			let amapPlugin = new amap.AMapWX({
					key: config.GAODE_KEY
				}),
				self = this,
				now = new Date();
			self.dateTime = [now.getMonth() + 1, '月', now.getDate(), '日', '&nbsp;', config.WEEK_ENUM[now.getDay()]].join('');
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
</style>
