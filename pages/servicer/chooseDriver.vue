<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">事故车型：<text class="uni-color-797 uni-common-ml">{{carCate}}</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">是否起吊：<text class="uni-color-797 uni-common-ml">{{hang}}</text></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">救援车辆</view>
				<picker placeholder="请选择" @change="bindPickerCarChange" :v-model="selectedCarIndex" :range="cars" range-key="text">
					<view class="uni-input">{{cars[selectedCarIndex].text}}</view>
				</picker>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">救援师傅</view>
				<picker placeholder="请选择" @change="bindPickerDriverChange" :v-model="selectedDriverIndex" :range="drivers" range-key="text">
					<view class="uni-input">{{drivers[selectedDriverIndex] ? drivers[selectedDriverIndex].text : '请选择'}}</view>
				</picker>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">预计费用：<input class="uni-input" v-model="fee" placeholder="根据您填写的信息自动计算" /></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="uni-row uni-center uni-h6">如您在救援车辆启程后取消本次服务,须支付预计费用50%的放空费用</view>
			</view>
		</view>
		<view class="uni-form-item uni-column mb-20">
			<view class="uni-common-mt" >
				<button @click="submit" type="primary">确定</button>
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
				id: '',
				name: '张三',
				tel: '18111111111',
				cartNo: '湘A-111111',
				carCate: '小轿车',
                fromAddress: '事故北京海淀区沟沟',
                toAddress: '拖至北京昌平区沟沟',
                hang: '是',
                fee: '200',
                selectedCarIndex: 0,
                selectedDriverIndex: 2,
                cars: [
                    {id: 1, text: '湘A-222222-小拖车(不带吊)'},
                    {id: 2, text: '湘A-333333-大拖车(带吊)'}
                ],
                drivers: [
                    {id: 1, text: '赵三哥-C1-13111111111'},
                    {id: 2, text: '许三多-C2-13111111112'},
                    {id: 3, text: '许三多-C2-13111111112'},
                    {id: 4, text: '许四多-C2-13111111112'}
                ]
            }
		},
		onLoad(param) {
			this.id = param.id;
			uni.setNavigationBarTitle({
				title: [this.cartNo, this.name, this.tel].join('-')
			})
		},
		methods: {
            bindPickerCarChange: function (e) {
                this.selectedCarIndex = e.target.value;
            },
            bindPickerDriverChange: function (e) {
                this.selectedDriverIndex= e.target.value;
            },
			submit(){
				uni.showModal({
                    title: '确认分配车辆与司机信息',
                    confirmText: '确定并提交',
                    cancelText: '再修改一下',
                    content: ['师傅：', this.drivers[this.selectedDriverIndex].text,'  将使用车辆：', this.cars[this.selectedCarIndex].text,'  处理本订单'].join(''),
                    success(res) {
                        if (res.confirm) {
                            uni.showLoading({
                                title: '处理中,请稍候'
                            });

                            setTimeout(function () {
                                uni.switchTab({
                                    url: '/'
                                });
                            }, 1500);
                        }
                    }
                });
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
