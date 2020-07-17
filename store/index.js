import Vue from 'vue';
import Vuex from 'vuex';
import config from '@/common/config';
import MUTATION_TYPES from './mutation-types/mutation-types';

Vue.use(Vuex);
/**
 * 将用户信息存储到本地缓存
 */
const storeUserInfo = store => {
	store.subscribe(function(mutation, state) {
		const mutationName = mutation.type.toUpperCase();
		if (['LOGIN', 'LOGOUT', 'SETRULE', 'SETWXLOGIN', 'SETWXCODE', 'SETWXTEL', 'UPDATETOKEN'].indexOf(
				mutationName) !==
			-1) {
			if (mutationName === 'LOGOUT') {
				uni.removeStorage({
					key: "user"
				});
			} else {
				uni.setStorage({
					key: "user",
					data: JSON.parse(JSON.stringify(state.user))
				});
			}
			return;
		}
	});
}

const initStorageData = {
		islogin: false, //是否登录
		token: '',
		rule: 0, //用户角色 0：事故车主；1：司机；2：客服; 3: 管理员
		wxCode: '', //微信CODE
		wxLogin: false, //微信是否已登录
		tel: '', //用户手机号
		nickName: '亲爱的用户', //用户昵称
		headImg: '' //用户头像
	},
	TRUE = true,
	FALSE = false;

const userstoredata = uni.getStorageSync('user');
//userstoredata.rule = parseInt(userstoredata.rule); //转换rule为数字
Object.assign(initStorageData, userstoredata || {});
const store = new Vuex.Store({
	state: {
		user: initStorageData,
		...config
	},
	mutations: {
		[MUTATION_TYPES.LOGIN](state, provider) {
			state.user.rule = +provider.rule;
			state.user.token = provider.token;
			state.user.nickName = provider.nickName;
			state.user.headImg = provider.headImg;
			state.user.tel = provider.tel;
			state.user.islogin = true;
		},
		[MUTATION_TYPES.LOGOUT](state) {
			state.user.islogin = false;
			state.user.rule = 0;
			state.user.token = '';
			state.user.tel = '';
			state.user.nickName = '亲爱的用户';
			state.user.headImg = '';
		},
		[MUTATION_TYPES.SET_WXCODE](state, code) {
			state.user.wxCode = code;
		},
		[MUTATION_TYPES.UPDATE_TOKEN](state, token) {
			state.user.token = token;
		},
		[MUTATION_TYPES.SET_WXLOGIN](state, status) {
			state.user.wxLogin = status;
		},
		[MUTATION_TYPES.BIND_WXTEL](state, tel) {
			state.user.tel = tel;
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
		setWXLogin({
			commit
		}, status) {
			commit(MUTATION_TYPES.SET_WXLOGIN, status);
		},
		setWXCode({
			commit
		}, code) {
			commit(MUTATION_TYPES.SET_WXCODE, code);
		},
		updateToken({
			commit
		}, token) {
			commit(MUTATION_TYPES.UPDATE_TOKEN, token);
		},
		setWXTel({
			commit
		}, tel) {
			commit(MUTATION_TYPES.BIND_WXTEL, tel);
		}
	},
	plugins: [storeUserInfo]
});

export default store;
