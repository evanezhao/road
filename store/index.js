import Vue from 'vue';
import Vuex from 'vuex';
import config from '@/common/config.js';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: {
            isLocationAuto: false, //是否位置授权
            islogin: false, //是否登录
            token: '',
            rule: 0, //用户角色
            tel: '18555555555', //用户手机号
            nickName: '司机朋友1', //用户昵称
            headImg: '' //用户头像
        },
        ...config
    },
    mutations: {
        login(state, provider) {
            state.user.rule = provider.rule;
            state.user.token = provider.token;
            state.user.nickName = provider.nickName;
            state.user.headImg = provider.headImg;
        },
        logout(state) {
            state.user.rule = '';
            state.user.token = '';
            state.user.tel = '';
            state.user.nickName = '司机朋友';
            state.user.headImg = '';
        },
        setLocAuto(state, val) {
            state.user.isLocationAuto = val;
        },
        openLocAuto(state, callback) {
            let self = this;
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
                            state.user.isLocationAuto = isAuto;
                            callback(isAuto);
                        }
                    })
                    //#endif
                }
            });
        }
    }
});

export default store;