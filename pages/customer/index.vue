<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}}</text>
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
				weather1: {
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
				self = this;
			amapPlugin.getWeather({
				type: 'live',
				success: function(data) {
					debugger;
					let weather;
					if (data && data.lives && data.lives.length) {						
						weather = data.lives[0];
						({...self.weather1} = weather);
					}
				},
				fail: function(info) {
					console.log(info);
				}
			})
		},
		methods: {

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
