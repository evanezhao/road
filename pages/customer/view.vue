<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">姓名：<text class="uni-color-797 uni-common-ml">{{name}}</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">联系电话：<text class="uni-color-797 uni-common-ml">{{tel}}</text>
					<uni-icon size="30" type="phone-filled" color="#007aff" @click="call(tel)"></uni-icon>
				</view>

			</view>
			<view class="uni-form-item uni-column">
				<view class="title">车牌号码：<text class="uni-color-797 uni-common-ml">{{cartNo}}</text></view>

			</view>
			<view class="uni-form-item uni-column">
				<view class="title">事故车型：<text class="uni-color-797 uni-common-ml">{{carCate}}</text></view>

			</view>
			<view class="uni-form-item uni-column">
				<view class="title">事故地址：</view>
				<text class="uni-color-797 uni-common-ml">{{fromAddress}}</text>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">拖送地址：</view>
				<text class="uni-color-797 uni-common-ml">{{toAddress}}</text>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">是否起吊：<text class="uni-color-797 uni-common-ml">{{hang}}</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">预计费用：<text class="uni-color-797 uni-common-ml">{{fee}}元</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="uni-row uni-center uni-h6">如您在救援车辆启程后取消本次服务,须支付预计费用50%的放空费用</view>
			</view>
		</view>
		<view class="uni-form-item uni-column mb-20">
			<navigator url="/pages/customer/choosePos/viewPos" class="uni-common-mt" hover-class="navigator-hover">
				<button type="primary">查看位置</button>
			</navigator>
		</view>
		<view style="position: fixed;right: 20upx;top:100upx; width: 300upx;height: 50upx;border-radius: 50upx;background-color: #576B95;color: #FFFFFF;font-size: 40upx;line-height: 50upx;text-align: center;padding: 30upx 0;">
			{{status|setStatusText}}
		</view>
	</view>
</template>

<script>
	var util = require('@/common/util.js');
	var formatLocation = util.formatLocation;

	import uniIcon from '@/components/uni-icon/uni-icon.vue';
	import config from '../../common/config.js';
	export default {
		components: {
			uniIcon
		},
		data() {
			return {
				id: '',
				name: '张三',
				tel: '18111111111',
				cartNo: '湘A-111111',
				carCate: '小轿车',
				status: 1,
				fromAddress: '事故北京海淀区沟沟',
				toAddress: '拖至北京昌平区沟沟',
				hang: '是',
				fee: '200'
			}
		},
		filters: {
			setStatusText(status) {
				return config.orderStatus[status];
			}
		},
		onLoad(param) {
			this.id = param.id;
			uni.setNavigationBarTitle({
				title: [this.cartNo, this.name, this.tel].join('-')
			})
		},
		methods: {
			call(tel) {
				uni.makePhoneCall({
					phoneNumber: tel
				})
			}
		}
	}
</script>

<style>
	.uni-h6 {
		margin-top: 20upx;
	}

	.mb-20 {
		margin-bottom: 90upx;
	}
</style>
