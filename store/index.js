import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user:{
			rule:''
		}
	},
	mutations: {
		initUser(state, provider) {
			state.user.rule = provider.rule;
		}
	}
})

export default store
