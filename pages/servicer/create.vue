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
					<view class="title">车牌号码 <text style="margin-left: 30upx;text-decoration: underline;color: #007AFF;" @click="carInputClick">请选择</text></view>
					<input class="uni-input" disabled="true" :value="orderInfo.cartNo" placeholder="请填写" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">车型</view>
					<picker placeholder="请选择" @change="bindPickerChange" v-model="carCateIndex" :range="carCate">
						<view class="uni-input">{{orderInfo.carCate}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">事故地址 <text style="margin-left: 30upx;text-decoration: underline;color: #007AFF;" @click="chooseLocation($event,false)">请选择</text></view>
					<input class="uni-input" disabled="true" :value="orderInfo.fromAddress" placeholder="请填写" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">拖送地址 <text style="margin-left: 30upx;text-decoration: underline;color: #007AFF;" @click="chooseLocation($event,true)">请选择</text></view>
					<input class="uni-input" disabled="true" :value="orderInfo.toAddress" placeholder="请填写" />
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
					<input class="uni-input" v-model="orderInfo.price" placeholder="根据您填写的信息自动计算" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">放空费用</view>
					<input class="uni-input" v-model="orderInfo.fee" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">订单状态</view>
					<picker placeholder="请选择" @change="bindStatusChange" :range="statusEnumArr" range-key="name">
						<view class="uni-input">{{statusEnum[orderInfo.status]}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">支付类型</view>
					<picker placeholder="请选择" @change="bindPayTypeChange" :range="payTypeEnumArr" range-key="name">
						<view class="uni-input">{{payTypeEnum[orderInfo.payType]}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">单据状态(当支付类型为单据时生效)</view>
					<picker placeholder="请选择" @change="bindBillStatusChange" :range="billStatusEnumArr" range-key="name">
						<view class="uni-input">{{billStatusEnum[orderInfo.billStatus]}}</view>
					</picker>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">支付状态</view>
					<picker placeholder="请选择" @change="bindPayStatusChange" :range="payStatusEnumArr" range-key="name">
						<view class="uni-input">{{payStatusEnum[orderInfo.payStatus]}}</view>
					</picker>
				</view>
			</view>
			<view class="uni-form-item uni-column mb-20">
				<button type="primary" form-type="submit" style="width: 95%;">提交信息</button>
			</view>
		</form>
		<plate-number ref="plate" v-model="orderInfo.cartNo" @on-input-change="onInputChang" @showOrHide="showOrHide"></plate-number>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	import amap from '@/common/amap-wx.js';
	import plateNumber from '@/components/plate-number/plateNumber.vue';
	import cursor from '@/static/cursor.gif';
	import energy from '@/static/energy.png';
	var util = require('@/common/util.js');
	var formatLocation = util.formatLocation;

	export default {
		components: {
			plateNumber
		},
		data() {
			return {
				amapPlugin: null,
				cursor: '', //输入焦点gif地址
				isCursor: true, //是否显示焦点
				energy: '', //新能源图标的地址
				title: '请输入相关信息以便我们能更快到达现场',
				carCateIndex: 0,
				location: {},
				carCate: ['小轿车', '中型SUV', '大型SUV', '中型卡车', '大型卡车', '公交车', '其它中型车', '其它大型车'],
				address: '请选择',
				statusEnumArr: [],
				billStatusEnumArr: [],
				payStatusEnumArr: [],
				payTypeEnumArr: [],
				orderInfo: {
					name: '',
					tel: '',
					cartNo: '',
					carCate: '',
					fromPos: [],
					fromAddress: '',
					toPos: [],
					toAddress: '',
					hang: false,
					status: 0,
					payType: 0,
					billStatus: -1,
					payStatus: 0,
					price: 0,
					fee: 0
				}
			}
		},
		computed: {
			...mapState(['user', 'GAODE_KEY', 'statusEnum', 'billStatusEnum', 'payStatusEnum', 'payTypeEnum'])
		},
		onReady() {

		},
		onLoad() {
			const self = this;

			for (let key in self.statusEnum) {
				if (self.statusEnum.hasOwnProperty(key)) {
					self.statusEnumArr.push({
						name: self.statusEnum[key],
						value: key
					});
				}
			}
			for (let key in self.billStatusEnum) {
				if (self.billStatusEnum.hasOwnProperty(key)) {
					self.billStatusEnumArr.push({
						name: self.billStatusEnum[key],
						value: key
					});
				}
			}
			for (let key in self.payStatusEnum) {
				if (self.payStatusEnum.hasOwnProperty(key)) {
					self.payStatusEnumArr.push({
						name: self.payStatusEnum[key],
						value: key
					});
				}
			}
			for (let key in self.payTypeEnum) {
				if (self.payTypeEnum.hasOwnProperty(key)) {
					self.payTypeEnumArr.push({
						name: self.payTypeEnum[key],
						value: key
					});
				}
			}
			self.amapPlugin = new amap.AMapWX({
				key: self.GAODE_KEY
			});
			//初始化
			// this.$refs.plate.init();
			self.cursor = cursor;
			self.energy = energy;
			//this.carInputClick();
			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					self.orderInfo.fromPos = [res.longitude, res.latitude];
					self.amapPlugin.getRegeo({
						location: `${res.longitude},${ res.latitude}`,
						success(addressData) {
							self.orderInfo.fromAddress = `${addressData[0].desc}(${addressData[0].name})`;
						}
					});
				},
				fail(res) {
					console.log(res);
				}
			});
		},
		onShow() {

		},
		onHide() {
			//恢复初始化
			this.orderInfo.cartNo = '';
		},
		methods: {
			bindPickerChange: function(e) {
				this.orderInfo.carCate = this.carCate[e.target.value];
			},
			bindStatusChange: function(e) {
				this.orderInfo.status = this.statusEnumArr[e.target.value].value;
			},
			bindBillStatusChange: function(e) {
				this.orderInfo.billStatus = this.billStatusEnumArr[e.target.value].value;
			},
			bindPayStatusChange: function(e) {
				this.orderInfo.payStatus = this.payStatusEnumArr[e.target.value].value;
			},
			bindPayTypeChange: function(e) {
				this.orderInfo.payType = this.payTypeEnumArr[e.target.value].value;
			},
			changeHang: function(e) {
				this.orderInfo.hang = e.detail.value.length > 0;
			},
			onInputChang(val) {
				this.orderInfo.cartNo = val;
			},
			chooseLocation: function(event, isToAddress) {
				var self = this;

				//#ifdef MP-WEIXIN
				self.$permission.weixinCheck('userLocation').then(function() {
					self.openLocation(isToAddress);
				});
				//#endif

				//#ifdef H5
				this.openLocation(isToAddress);
				//#endif
			},
			openLocation(isToAddress) {
				var self = this,
					param = {
						success: (res) => {
							console.log(res.longitude, res.latitude);
							self.location = formatLocation(res.longitude, res.latitude);
							self.orderInfo[isToAddress ? 'toPos' : 'fromPos'] = [res.longitude, res.latitude];
							self.orderInfo[isToAddress ? 'toAddress' : 'fromAddress'] = `${res.name}(${res.address})`;
						}
					},
					pos = self.orderInfo[isToAddress ? 'toPos' : 'fromPos'];
				if (pos.length) {
					param.longitude = pos[0];
					param.latitude = pos[1];
					uni.chooseLocation(param);
				} else {
					uni.getLocation({
						type: 'gcj02',
						success: function(res) {
							param.longitude = res.longitude;
							param.latitude = res.latitude;
							uni.chooseLocation(param);
						}
					});
				}
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
					uni.request({
						url: this.$apis.order.create,
						method: 'POST',
						data: {
							token: this.user.token,
							name: orderInfo.name,
							tel: orderInfo.tel,
							cartNo: orderInfo.cartNo,
							carCate: orderInfo.carCate,
							fromPos: orderInfo.fromPos,
							fromAddress: orderInfo.fromAddress,
							toPos: orderInfo.toPos,
							toAddress: orderInfo.toAddress,
							hang: orderInfo.hang,
							fee: orderInfo.fee,
							price: orderInfo.price,
							status: orderInfo.status,
							payType: orderInfo.payType,
							billStatus: orderInfo.billStatus,
							payStatus: orderInfo.payStatus,
							log: [{
								cate: 1,
								content: '创建订单'
							}]
						},
						success: res => {
							let opt = {
								title: '温馨提示',
								content: '',
								showCancel: false,
								success: function() {
									uni.navigateBack();
								}
							};

							if (res.data.status === 200) {
								opt.content = '你的救援申请已成功提交，我们将尽快安排车辆，您也可致电联系我们：0731-85631851';
							} else {
								opt.content = '你的救援申请提交失败：' + res.data.message;
							}
							uni.showModal(opt);
						},
						fail: (err) => {
							uni.showModal({
								title: '温馨提示',
								content: '你的救援申请提交失败，您可致电联系我们：0731-85631851',
								showCancel: false,
								success: function() {
									uni.navigateBack();
								}
							});
						},
						complete: () => {}
					});

				}
			},
			/**
			 * @desc 车牌选择关闭和打开
			 */
			showOrHide(falg) {
				this.isCursor = falg;
			},
			/**
			 * @desc 显示车牌选择器
			 */
			carInputClick() {
				this.$refs.plate.show();
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
