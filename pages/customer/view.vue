<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">订单状态：<text class="uni-color-797 uni-common-ml">{{statusText}}</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">客户姓名：<text class="uni-color-797 uni-common-ml">{{name}}</text></view>
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
				<view class="title">是否起吊：<text class="uni-color-797 uni-common-ml">{{!!hang?'需要起吊':'无需起吊'}}</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">预计费用：<text class="uni-color-797 uni-common-ml">{{fee}}</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">支付信息：<text class="uni-color-797 uni-common-ml">{{payType|setPayInfo(billStatus,payStatus)}}</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="uni-row uni-center uni-h6">如您在救援车辆启程后取消本次服务,须支付预计费用50%的放空费用</view>
			</view>
		</view>
		<view class="uni-form-item uni-column">
			<navigator :url="positionUrl" class="uni-common-mt" hover-class="navigator-hover">
				<button type="warn">查看位置</button>
			</navigator>
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
				name: '',
				tel: '',
				cartNo: '',
				carCate: '',
				status: 0,
				statusText: '',
				payType: 0,
				payTypeText: '',
				billStatus: 0,
				billStatusText: '',
				payStatus: 0,
				payStatusText: '',
				fromPos:[],
				fromAddress: '',
				positionUrl:'',
				toPos:[],
				toAddress: '',
				hang: '',
				fee: ''
			}
		},
		filters: {
			setStatusText(status) {
				return config.orderStatus[status];
			},
			setPayInfo(payType, billStatus, payStatus) {
				let payInfoStr = [];

				switch (payType) {
					case 0:
						payInfoStr.push('现金结算');
						payInfoStr.push(!!payStatus ? '，已支付' : '，未支付');
						break;
					case 1:
						payInfoStr.push('微信结算');
						payInfoStr.push(!!payStatus ? '，已支付' : '，未支付');
						break;
					case 2:
						payInfoStr.push('单据结算');
						payInfoStr.push(!!billStatus ? '，未提交单据' : '，已提交单据');
						break;
					default:
						payInfoStr.push('其它结算');
						payInfoStr.push(!!payStatus ? '，已支付' : '，未支付');
						break;
				}
				return payInfoStr.join('');

			},
		},
		onLoad(param) {
			const self = this;
			self.id = param.id;

			this.$req({
				url: self.$apis.order.get + self.id,
				method: 'GET',
				success(res) {
					console.log(res);
					let {
						name,
						tel,
						cartNo,
						carCate,
						status,
						statusText,
						fromPos,
						fromAddress,
						toPos,
						toAddress,
						hang,
						fee
					} = res.data.data
					self.name = name;
					self.tel = tel;
					self.cartNo = cartNo;
					self.carCate = carCate;
					self.status = status;
					self.statusText = statusText;
					self.fromPos = fromPos;
					self.fromAddress = fromAddress;
					self.toPos = toPos;
					self.toAddress = toAddress;
					self.hang = hang;
					self.fee = fee > 0 ? (fee + '元') : '待定';
					self.positionUrl = `/pages/customer/choosePos/viewPos?from=${fromPos.join(",")}&to=${toPos.join(",")}`;
					uni.setNavigationBarTitle({
						title: [self.name, self.tel].join('-')
					});
				},
				fail(err) {
					console.log(`获取订单失败：${err.errMsg}`);
				}
			});
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
