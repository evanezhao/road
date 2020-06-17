//const reqDomain = 'http://192.168.0.112:8080'
const reqDomain = 'https://www.cshelp.cn'

export default {
	user: {
		bindwx: reqDomain + '/api/user/bindWXUser',
		bindtel: reqDomain + '/api/user/bindWXTel',
		updateToken: reqDomain + '/api/user/updateToken'
	},
	order: {
		create: reqDomain + '/api/order/new',
		list: reqDomain + '/api/order/list',
		getMyOrder: reqDomain + '/api/order/getMyOrder',
		getMyOrderForPage: reqDomain + '/api/order/getMyOrderForPage',
		get: reqDomain + '/api/order/'
	}
};
