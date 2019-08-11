import Vue from 'vue';
import Vuex from 'vuex';
import config from '@/common/config';
import MUTATION_TYPES from './mutation-types/mutation-types';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		user: {
			isLocationAuto: false, //是否位置授权
			islogin: false, //是否登录
			token: '',
			rule: 3, //用户角色 0：未初始化；1：事故车主；2：司机；3：客服
			tel: '18555555555', //用户手机号
			nickName: '司机朋友1', //用户昵称
			headImg: '' //用户头像
		},
		...config
	},
	mutations: {
		[MUTATION_TYPES.LOGIN](state, provider) {
			state.user.rule = provider.rule;
			state.user.token = provider.token;
			state.user.nickName = provider.nickName;
			state.user.headImg = provider.headImg;
		},
		[MUTATION_TYPES.LOGOUT](state) {
			state.user.rule = '';
			state.user.token = '';
			state.user.tel = '';
			state.user.nickName = '司机朋友';
			state.user.headImg = '';
		},
		[MUTATION_TYPES.SET_LOCAUTO](state, val) {
			state.user.isLocationAuto = val;
		},
		[MUTATION_TYPES.SET_RULE](state, rule) {
			state.user.rule = rule;
		}
	},
	actions: {
		login({
			commit
		}, user) {
			commit(MUTATION_TYPES.LOGIN, user);
		},
		logout({
			commit
		}) {
			commit(MUTATION_TYPES.LOGOUT);
		},
		setLocAuto({
			commit
		}) {
			commit(MUTATION_TYPES.SET_LOCAUTO);
		},
		setRule({
			commit
		}, rule) {
			commit(MUTATION_TYPES.SET_RULE, rule);
		},
		openLocAuto({
			commit
		}) {
			return new Promise((resolve, reject) => {
				uni.showModal({
					showCancel: false,
					title: "位置申请",
					content: "我们需要您授权使用您的位置信息，相关功能才能正常使用，请在接下来的设置中选择\"位置信息\" -> \"仅在使用小程序期间\" 或者 \"使用小程序期间和离开小程序后\"",
					success() {
						//#ifdef MP-WEIXIN
						wx.openSetting({
							success(res) {
								let isAuto = !!res.authSetting['scope.userLocation'];
								console.log(res.authSetting);
								commit(MUTATION_TYPES.SET_LOCAUTO, isAuto);
								resolve(isAuto);
							},
							fail: reject
						});
						//#endif
					}
				});
			});
		}
	}
});

export default store;
