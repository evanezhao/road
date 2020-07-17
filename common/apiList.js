//const reqDomain = 'http://192.168.0.112:8080'
const reqDomain = 'https://www.cshelp.cn';

export default {
	user: {
		bindwx: reqDomain + '/api/user/bindWXUser',
		bindtel: reqDomain + '/api/user/bindWXTel',
		updateToken: reqDomain + '/api/user/updateToken',
		reportPostion: reqDomain + '/api/user/reportPostion',
		getPostion: reqDomain + '/api/user/getPostion',
		getDriver: reqDomain + '/api/user/getDriver'
	},
	order: {
		create: reqDomain + '/api/order/new',
		list: reqDomain + '/api/order/list',
		getMyOrder: reqDomain + '/api/order/getMyOrder',
		getMyOrderForPage: reqDomain + '/api/order/getMyOrderForPage',
		get: reqDomain + '/api/order/',
		claim: reqDomain + '/api/order/claim'
	}
};
