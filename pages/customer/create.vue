<template>
	<view>
		<form @submit="order">
			<view class="uni-padding-wrap uni-common-mt">
				<view class="uni-form-item uni-column">
					<view class="title">姓名</view>
					<input class="uni-input" v-model="orderInfo.name" maxlength="10" placeholder="如:张先生,张三" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">联系电话</view>
					<input class="uni-input" v-model="orderInfo.tel" type="number" maxlength="18" placeholder="请填写" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">车牌号码</view>
					<input class="uni-input" v-model="orderInfo.cartNo" placeholder="请填写" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">车型</view>
					<picker placeholder="请选择" @change="bindPickerChange" v-model="carCateIndex" :range="carCate">
						<view class="uni-input">{{orderInfo.carCate}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">事故地址 <text style="margin-left: 30upx;text-decoration: underline;color: #007AFF;" @click="chooseLocation($event,false)">请选择</text></view>
					<text style="margin-left: 30upx;">{{orderInfo.fromAddress}}</text>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">拖送地址 <text style="margin-left: 30upx;text-decoration: underline;color: #007AFF;" @click="chooseLocation($event,true)">请选择</text></view>
					<text style="margin-left: 30upx;">{{orderInfo.toAddress}}</text>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">是否起吊</view>
					<checkbox-group @change="changeHang">
						<view style="padding-left: 30upx;">
							<label>
								<checkbox />需要起吊</label>
						</view>
					</checkbox-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">预计费用</view>
					<input class="uni-input" v-model="orderInfo.fee" placeholder="根据您填写的信息自动计算" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="uni-row uni-center uni-h6">如您在救援车辆启程后取消本次服务,须支付预计费用50%的放空费用</view>
				</view>
			</view>
			<view class="uni-form-item uni-column mb-20">
				<button type="primary" form-type="submit" style="width: 95%;">提交信息</button>
			</view>
		</form>
	</view>
</template>

<script>
	var util = require('@/common/util.js');
	var formatLocation = util.formatLocation;

	export default {
		data() {
			return {
				title: '请输入相关信息以便我们能更快到达现场',
				carCateIndex: 0,
				location: {},
				carCate: ['小轿车', '中型SUV', '大型SUV', '中型卡车', '大型卡车', '公交车', '其它中型车', '其它大型车'],
				address: '请选择',
				orderInfo: {
					name: '',
					tel: '',
					cartNo: '',
					carCate: '',
					fromAddress: '',
					toAddress: '',
					hang: false,
					fee: 0
				}
			}
		},
		onLoad() {},
		methods: {
			bindPickerChange: function(e) {
				this.orderInfo.carCate = this.carCate[e.target.value];
			},
			changeHang:function(e){
				this.orderInfo.hang = e.detail.value.length > 0;
			},
			chooseLocation: function(event, isToAddress) {
				var self = this;

				uni.chooseLocation({
					success: (res) => {
						console.log(res.longitude, res.latitude);
						self.location = formatLocation(res.longitude, res.latitude);
						self.orderInfo[isToAddress ? 'toAddress' : 'fromAddress'] = res.address;
					}
				})
			},
			order: function() {
				var orderInfo = this.orderInfo,
					err;

				if (orderInfo.name === '') {
					err = '请填写姓名'
				} else if (orderInfo.tel === '') {
					err = '请填写联系电话'
				} else if (orderInfo.cartNo === '') {
					err = '请填写车牌号码'
				} else if (orderInfo.carCate === '') {
					err = '请选择车型'
				} else if (orderInfo.fromAddress === '') {
					err = '请选择事故地址'
				} else if (orderInfo.toAddress === '') {
					err = '请选择事故车送达地址'
				} else {
					err = '';
				}
				if (!!err) {
					uni.showToast({
						icon: 'none',
						title: err
					});
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '你的救援申请已成功提交，我们将尽快安排车辆，您也可致电联系我们：0731-85631851',
						showCancel: false,
						success: function() {
							console.log(orderInfo);
							uni.navigateBack();
						}
					});
				}
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
