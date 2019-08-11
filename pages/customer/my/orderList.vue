<template>
	<view class="page">
		<page-head v-if="!orders.length" title="暂无记录"></page-head>
		<view v-if="orders.length>0" class="uni-list">
			<block v-for="(order,index) in orders" :key="index">
				<navigator :url="'/pages/customer/view?id='+order.id" class="uni-list-cell" hover-class="uni-list-cell-hover">
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
				showLoadMore: false,
				max: 0,
				orders: [{
						id: 'a',
						cartNo: '湘A-111111',
						name: '1赵先生',
						status: 2,
						fromAddress: '北京海淀区沟沟',
						toAddress: '北京昌平区沟沟北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-8-1 12:30:00'
					},
					{
						id: 'b',
						cartNo: '湘A-222222',
						name: '2天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'c',
						cartNo: '湘A-222222',
						name: '3天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'd',
						cartNo: '湘A-222222',
						name: '4天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'e',
						cartNo: '湘A-222222',
						name: '5天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'f',
						cartNo: '湘A-222222',
						name: '6天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'g',
						cartNo: '湘A-222222',
						name: '7天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'h',
						cartNo: '湘A-222222',
						name: '8天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'i',
						cartNo: '湘A-222222',
						name: '8天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'j',
						cartNo: '湘A-222222',
						name: '9天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					},
					{
						id: 'k',
						cartNo: '湘A-222222',
						name: '10天先生',
						status: 0,
						fromAddress: '北京海淀区沟沟1',
						toAddress: '北京昌平区沟沟2北京昌平区沟沟北京昌平区沟沟',
						createTime: '2019-10-11 12:30:00'
					}

				]
			}
		},
		computed: {
			...mapState(['user', 'orderStatus', 'orderColor'])
		},
		onLoad() {
			this.$data.orders.forEach(this.transferStatus);
		},
		methods:{
			transferStatus(order){
				var dateTimeArr = !!order.createTime ? order.createTime.split(/\s/g) : [];				
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
