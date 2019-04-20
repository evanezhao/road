<template>
	<view>
		<view class="uni-padding-wrap">
			<view v-if="ruleVisible" class="uni-title">
				欢迎回来：{{rule.key}}
			</view>
			<view v-else class="uni-title">
				请选择您的角色：{{rule.name}}
			</view>
		</view>
		<view v-if="visible">
			<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in rules" :key="index">{{item.name}}</view>
				</picker-view-column>
			</picker-view>
			<view class="uni-padding-wrap uni-float-bottom">
				<button type="primary" @click="login">开始进入</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			const rules = [{
					'key': 'customer',
					'name': '客户(请求救援)'
				},
				{
					'key': 'servicer',
					'name': '客服'
				},
				{
					'key': 'manager',
					'name': '管理员'
				},
				{
					'key': 'driver',
					'name': '司机'
				}
			];
			const rule = rules[0];
			return {
				title: 'picker-view',
				rule,
				rules,
				value: [0],
				ruleVisible: false,
				/**
				 * 解决动态设置indicator-style不生效的问题
				 */
				visible: true,
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
			}
		},
		mounted() {
			let rule = uni.getStorageSync('rule');
			if (!!rule) {
				this.rule.key = rule;
				this.ruleVisible = true;
				this.visible = false;
				setTimeout(() => {
					this.login()
				}, 3000);
			}
		},
		computed: {
			...mapState(['user'])
		},
		methods: {
			bindChange(e) {
				const val = e.detail.value
				this.rule = this.rules[val[0]];
			},
			login(e) {
				uni.setStorage({
					key: 'rule',
					data: this.rule.key
				});
				this.initUser({
					rule: this.rule.key
				});
				uni.switchTab({
					url: '/pages/index/pai'
				});
			},
			...mapMutations(['initUser'])
		}
	}
</script>

<style>
	picker-view {
		width: 100%;
		height: 600upx;
		margin-top: 20upx;
	}

	.item {
		line-height: 100upx;
		text-align: center;
	}

	.uni-float-bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
	}
</style>
