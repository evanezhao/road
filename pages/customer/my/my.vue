<template>
	<view class="uni-flex uni-column uni-margin-wrap">
		<view class="uni-flex uni-row" style="background-image: linear-gradient(to bottom, #99cccc 20%,#7171b7 80%);color: #fff;height: 200upx;padding-top: 40upx;">
			<view class="uni-flex uni-column" style="width: 40%;align-items: center;justify-content: flex-start;">
				<view class="uni-flex uni-row" style="justify-content: center;border-radius:60upx; background-color: #FFFFFF;">
					<uni-icon type="person-filled" size="60" color="#8f8f94"></uni-icon>
				</view>

			</view>
			<view class="uni-flex uni-column" style="width: 60%; ">
				<view class="uni-flex uni-row title uni-h3">
					司机朋友
				</view>
				<view class="uni-flex uni-row">
					185****1111DS
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row uni-common-mt">
			<uni-list>
				<uni-list-item @click="toOrderList" title="我的记录" thumb="/static/order.png" showArrow="true" :showBadge="newOrderNum>0" :badgeText="newOrderNum"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon/uni-icon.vue';
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list/uni-list-item.vue'

	export default {
		components: {
			uniIcon,
			uniList,
			uniListItem
		},
		data() {
			return {
				newOrderNum: '1'
			}
		},
		methods: {
			toOrderList(){
				uni.navigateTo({
					url:"/pages/customer/my/orderList"
				});
			}
		}
	}
</script>

<style>

</style>
