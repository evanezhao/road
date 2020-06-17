import Vue from 'vue';
import App from './App';
import store from './store';
import apiUrls from './common/apiList.js';
import wxPermissionCheck from './common/wxPermission.js';
import localPos from './common/local.js';
import req from './common/req.js';
Vue.config.productionTip = false;


App.mpType = 'app';
Vue.prototype.$store = store;
Vue.prototype.$permission = {
	weixinCheck: wxPermissionCheck
};
Vue.prototype.$apis = apiUrls;
Vue.prototype.$req = req;

Vue.prototype.$localPos = localPos; //实时位置采集

const app = new Vue({
	...App
});
app.$mount();
