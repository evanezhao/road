<template>
	<view class="height100">
		<view class="uni-row uni-h6">地点提示:{{posDesc}}</view>

		<map id="mymap" class="height100" :longitude="log" :latitude="lat" show-location :markers="markers" :controls="endPos"
		 @regionchange="getDarpPos"></map>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';

	import amap from '@/common/amap-wx.js';
	export default {
		data() {
			return {
				log: 116.29845,
				lat: 39.95933,
				queryPosTimer: null,
				markers: [],
				pagePos: {
					w: 0,
					h: 0
				},
				key: '142adbd760618e123255c785283f7606',
				endPos: [],
				posDesc: 'aaaaaaaa',
				mapContext: {}
			}
		},
		beforeMount() {
			var self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.pagePos.w = res.windowWidth;
					self.pagePos.h = res.windowHeight;
				}
			});
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
						title: '我当前的位置',
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
					});
					self.markers = marks;
					console.log(self.pagePos.w, self.pagePos.h);
					self.endPos.push({
						id: 3,
						iconPath: '/static/pos_end.png',
						position: {
							left: self.pagePos.w / 2 - 19,
							top: self.pagePos.h / 2 - 19 - 16
						},
						clickable: true
					});
					self.showPosDesc(self.log, self.lat);
				}
			});
		},
		methods: {
			getDarpPos: function() {
				var self = this;
				self.mapContext.getCenterLocation({
					success: (pos) => {
						// { longitude: "经度", latitude: "纬度"}
						self.showPosDesc(pos.longitude, pos.latitude);
					}
				})
			},
			showPosDesc: function(lon, lat) {
				var self = this;
				if (self.queryPosTimer) {
					clearTimeout(self.queryPosTimer);
				}
				self.queryPosTimer = setTimeout(() => {
					self.amapPlugin.getRegeo({
						location: lon + ',' + lat,
						success: (result) => {
							if (result && result.length) {
								self.posDesc = result[0].desc + '(' + result[0].name + ')';
							} else {
								self.posDesc = '没有该位置信息';
							}
							clearTimeout(self.queryPosTimer);
						}
					});
				}, 300)
			}
		}
	}
</script>
<style>
	.height100 {
		width: 100%;
		height: 100%;
	}
</style>
