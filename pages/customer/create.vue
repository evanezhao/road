<template>
	<view>
		<form>
			<view class="uni-padding-wrap uni-common-mt">
				<view class="uni-form-item uni-column">
					<view class="title">姓名</view>
					<input class="uni-input" :disabled="isView" focus maxlength="10" placeholder="如:张先生,张三" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">联系电话</view>
					<input class="uni-input" :disabled="isView" type="number" maxlength="18" placeholder="请填写" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">车牌号码</view>
					<input class="uni-input" :disabled="isView" placeholder="请填写" />

				</view>
				<view class="uni-form-item uni-column">
					<view class="title">车型</view>
					<picker :v-if="isView" :disabled="isView" @change="bindPickerChange" :value="carCateIndex" :range="carCate">
						<view class="uni-input">{{carCate[carCateIndex]}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">拖送地址</view>
					<input class="uni-input" :disabled="isView" :value="address" @tap="chooseLocation" placeholder="请选择" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">是否起吊</view>
					<switch name="switch" :disabled="isView" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">预计费用</view>
					<input class="uni-input" :disabled="isReadOnly" placeholder="根据您填写的信息自动计算" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="uni-row uni-center uni-h6">如您在救援车辆启程后取消本次服务,须支付预计费用50%的放空费用</view>
				</view>
			</view>
			<view class="uni-form-item uni-column mb-20">
				<view class="uni-common-mt">
					<button @tap="topage" type="primary">{{btnText}}</button>
				</view>
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
				isReadOnly: true,
				isView: false,
				location: {},
				btnText: '提交',
				carCate: ['小轿车', '中型SUV', '大型SUV', '中型卡车', '大型卡车', '公交车', '其它中型车', '其它大型车'],
				address: '请选择'
			}
		},
		onLoad() {
			if (this.isView) {
				this.btnText = '查看司机位置'
			}
		},
		methods: {
			topage: function () {
				this.isView = true;
				uni.navigateTo({
					url: '/pages/customer/choosePos/viewPos'
				});
			},
			bindPickerChange: function(e) {
				this.carCateIndex = e.target.value;
			},
			chooseLocation: function() {
				var self = this;
				if (self.isView) {
					return;
				}
				uni.chooseLocation({
					success: (res) => {
						console.log(res.longitude, res.latitude);
						self.location = formatLocation(res.longitude, res.latitude);
						self.address = res.address;
					}
				})
			}
		}
	}
</script>

<style>
	.uni-h6 {
		margin-top: 20upx;
	}
	.mb-20{
		margin-bottom: 90upx;
	}
</style>
