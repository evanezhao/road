import Vue from 'vue';
import Vuex from 'vuex';
import config from '@/common/config.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user: {
			islogin: false,			//是否登录
			token: '',
			rule: 0,				//用户角色
			tel: '18555555555',		//用户手机号
			nickName: '司机朋友1',	//用户昵称
			headImg: ''				//用户头像
		},
		...config
	},
	mutations: {
		login(state, provider) {
			state.user.rule = provider.rule;
			state.token = provider.token;
			tel: '18555555555',
				state.nickName = provider.nickName;
			state.headImg = provider.headImg;
		},
		logout(state) {
			state.user.rule = '';
			state.token = '';
			tel: '',
				state.nickName = '司机朋友';
			state.headImg = '';
		}
	}
})

export default store
