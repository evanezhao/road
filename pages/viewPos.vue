<template>
	<view class="uni-page-body height100">
		<map id="mymap" class="height100" :latitude="latitude" :longitude="longitude" :markers="markers"></map>
	</view>
</template>

<script>
	//在地图上查看位置信息
	//需要在上一级页面注册事件 uni.$once('getMarks'
    export default {
        data() {
            return {
                latitude: null,
                longitude: null,
                markers: []
            }
        },
        onLoad() {
            let self = this;
            let mapContext = uni.createMapContext('mymap', self);
            uni.$emit('getMarks', (markers) => {

                self.latitude = markers[0].latitude;
                self.longitude = markers[0].longitude;
                self.markers = markers;
                mapContext.includePoints({
                    points: markers.map((item) => {
                        return {
                            latitude: item.latitude,
                            longitude: item.longitude
                        }
                    })
                });

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
