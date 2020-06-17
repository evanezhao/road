<template>
	<view class="uni-page-body height100">
		<map id="mymap" class="height100" :longitude="log" :latitude="lat" show-location :markers="markers" :polyline="polyline"
		 :include-points="includePoints"></map>
	</view>
</template>

<script>
	import amap from '@/common/amap-wx.js';
	
	export default {
		data() {
			return {
				log: 116.407526,
				lat: 39.90403,
				polyline: [],
				includePoints: [],
				markers: [],
				key: '142adbd760618e123255c785283f7606',
				mapContext: {}
			}
		},
		onLoad(param) {
			let marks = [],
				polyline = [],
				self = this,
				amapPlugin = new amap.AMapWX({
					key: self.key
				});
			this.mapContext = uni.createMapContext('mymap', this);

			amapPlugin.getDrivingRoute({
				origin: param.from,
				destination: param.to,
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
							color: '#0db114',
							borderColor:'183413',
							width:6,
							borderWidth:2,
						});
					});

					self.includePoints = includePoints;
					self.polyline = polyline;

					self.markers = [{
							iconPath: "/static/yuan.png",
							id: 0,
							longitude: polyline[0].points[0].longitude,
							latitude: polyline[0].points[0].latitude,
							title: '\u8d77\u70b9',
							width: 16,
							height: 16
						},
						{
							iconPath: "/static/pos_end.png",
							id: 1,
							longitude: polyline[polyline.length - 1].points[polyline[polyline.length - 1].points.length - 1].longitude,
							latitude: polyline[polyline.length - 1].points[polyline[polyline.length - 1].points.length - 1].latitude,
							title: '\u7ec8\u70b9',
							width: 32,
							height: 32
						}
					];

					let allPotlen = includePoints.length;

					(function move(timer) {
						setTimeout(() => {
							if (timer < allPotlen) {
								self.mapContext.translateMarker({
									markerId: 0,
									autoRotate:false,
									destination: {
										latitude: includePoints[timer].latitude,
										longitude: includePoints[timer].longitude,
									},
									autoRotate: true,
									rotate: 90
								});
								move(timer + 1);
							}
						}, 1000);
					}(0));
				}
			});

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
		height: 100%;
	}
</style>
