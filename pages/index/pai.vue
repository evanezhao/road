<template>
	<!-- <view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">当前登录的角色为:{{user.rule}}</text>
		</view>
		
	</view> -->
	<view class="uni-page-body height100">
		<map id="mymap" class="height100" :longitude="log" :latitude="lat" show-location :markers="markers" :polyline="polyline" :include-points="includePoints"></map>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	import amap from '../../common/amap-wx.js';

	export default {
		data() {
			return {
				log: 116.29845,
				lat: 39.95933,
				markers: [],
				polyline: [],
				includePoints: [],
				amapPlugin: null,
				key: '142adbd760618e123255c785283f7606',
				mapContext: {}
			}
		},
		onLoad() {
			let marks = [],
				polyline = [],
				self = this;
			self.amapPlugin = new amap.AMapWX({
				key: self.key
			});
			this.mapContext = uni.createMapContext('mymap', this);
			//获取当前位置
			uni.getLocation({
				type: 'gcj02',
				complete(result) {
					if (!result.latitude) {
						self.lat = 39.95933;
						self.log = 116.29845;
					} else {
						self.log = result.longitude;
						self.lat = result.latitude;
					}
					marks.push({
						id: 0,
						iconPath: '/static/pos_start.png',
						longitude: self.log,
						latitude: self.lat,
						title: '起点',
						callout: {
							content: '我',
							color: '#FFF',
							fontSize: 14,
							padding: 2,
							borderRadius: 100,
							textAlign: 'center',
							bgColor: '#1296db',
							display: 'ALWAYS'
						}
					}, {
						id: 1,
						iconPath: '/static/pos_end.png',
						latitude: 39.9771433172,
						longitude: 116.3062017268,
						title: '终点',
						callout: {
							content: '终',
							color: '#FFF',
							fontSize: 14,
							padding: 2,
							borderRadius: 100,
							textAlign: 'center',
							bgColor: '#d4237a',
							display: 'ALWAYS'
						}
					});

					self.amapPlugin.getDrivingRoute({
						origin: self.log + ',' + self.lat,
						destination: '116.3052177429,39.9767254644',
						strategy: 10,
						success: (data) => {
							let includePoints = [];
							data.paths[0].steps.forEach(item => {
								let points = [];
								item.polyline.split(';').forEach(point => {
									let pos = point.split(',');
									points.push({
										latitude: Number(pos[1]),
										longitude: Number(pos[0])
									});
								});
								includePoints = includePoints.concat(points);
								polyline.push({
									points,
									color: '#0066FF',
									width: 3
								});
							});
							self.includePoints = includePoints;
							self.markers = marks;
							self.polyline = polyline;

							setTimeout(() => {
								self.mapContext.moveToLocation();
								self.mapContext.translateMarker({
									markerId: 0,
									destination: {
										latitude: 39.9771433172,
										longitude: 116.3062017268,
									},
									autoRotate: true,
									rotate: 90
								});
							}, 3000);
						}
					});
				}
			});
		},
		beforeMount() {
			uni.setTabBarItem({
				index: 1,
				text: '司机'
			})
		},
		computed: {
			...mapState(['user'])
		},
		methods: {}
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

	.height100 {
		width: 100%;
		height:  100%;
	}
</style>
