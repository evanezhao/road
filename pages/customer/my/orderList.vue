<template>
	<view class="page">
		<page-head v-if="!orders.length" title="暂无记录"></page-head>
		<view v-if="orders.length>0" class="uni-list">
			<block v-for="(order,index) in orders" :key="index">
				<navigator :url="'/pages/customer/view?id='+order._id" class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-triplex-row">
						<view class="uni-triplex-left" style="width: 75%;">
							<view class="uni-title uni-ellipsis">{{order.cartNo}}<span class="uni-common-ml">{{order.name}}</span>
								<span class="uni-common-ml" :style="order.color">{{order.statusText}}</span></view>
							<text class="uni-text-small uni-ellipsis">事故地：{{order.fromAddress}}</text>
							<text class="uni-text-small uni-ellipsis">送灰地：{{order.toAddress}}</text>
						</view>
						<view class="uni-triplex-right" style="width: 25%;">
							<text class="uni-h5">{{order.createTime_Date}}</text>
							<text class="uni-h5">{{order.createTime_Time}}</text>
						</view>
					</view>
				</navigator>
			</block>
		</view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import enumConfig from '@/common/config.js';
	const {
		orderStatus,
		orderColor
	} = enumConfig;
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				loadMoreText: "加载中...",
				showLoadMore: true,
				max: 0,
				orders: []
			}
		},
		computed: {
			...mapState(['user', 'orderStatus', 'orderColor'])
		},
		onLoad() {
			const self = this;
			//this.$data.orders.forEach(this.transferStatus);

			self.$req({
				url: self.$apis.order.getMyOrder,
				method: 'GET',
				data: {
					type: '0'
				},
				success(res) {
					self.showLoadMore = false;
					if (res.data.status === 200) {

						if (res.data.data.length) {
							res.data.data.forEach(self.transferStatus);
							self.orders = res.data.data;
						}

					} else {
						uni.showToast({
							title: `获取我的订单失败：${res.data.message}`,
							icon: "none"
						});
					}
				},
				fail(err) {
					uni.showToast({
						title: `获取我的订单失败：${err.errMsg}`,
						icon: "none"
					});
				}
			});
		},
		methods: {
			transferStatus(order) {
				var dateTimeArr = !!order.date ? order.date.split(/\s/g) : [];
				order.createTime_Date = dateTimeArr.length > 0 ? dateTimeArr[0] : '';
				order.createTime_Time = dateTimeArr.length > 1 ? dateTimeArr[1] : '';
				order.statusText = this.orderStatus[order.status];
				order.color = "color:#" + this.orderColor[order.status];
			}
		},
		onReachBottom() {
			if (this.max > 40) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			this.max += 10;
			setTimeout(() => {
				var order = {
					id: 'i',
					cartNo: '京A-222222',
					name: '天先生天先生',
					status: 0,
					fromAddress: '北京海淀区沟沟1',
					toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
					createTime: '2019-10-11 12:30:00'
				};
				this.transferStatus(order);
				this.orders.push(order);
			}, 1000);

		}
	}
</script>

<style>

</style>
