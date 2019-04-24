<template>
	<view class="uni-flex uni-row">
		<view class="uni-flex uni-column" style="width: 20%;align-items: center;justify-content: flex-start;">
			<view class="uni-flex uni-row" style="justify-content: center;">
				<uni-icon type="person-filled" size="60" color="#8f8f94"></uni-icon>
			</view>

		</view>
		<view class="uni-flex uni-column" style="width: 30%;">
			<view class="uni-flex uni-row title uni-h3">
				您好
			</view>
			<view class="uni-flex uni-row">
				尊贵客户
			</view>
		</view>
		<view class="uni-flex uni-column" style="width: 50%;">
			<view class="uni-flex uni-row">
				<button size="mini" plain="true" type="primary" class="uni-common-mr">登录</button>
			</view>
			<view class="uni-flex uni-row uni-common-mt">
				<button size="mini" type="primary" plain="true" class="uni-common-ml">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon/uni-icon.vue';
	export default {
		components: {
			uniIcon
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
