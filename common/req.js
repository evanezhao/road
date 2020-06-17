function req(params) {
	const userstoredata = uni.getStorageSync('user'),
		token = userstoredata.token;

	params = params || {};
	if (params.header) {
		params.header['token'] = token;
	} else {
		params.header = {
			token
		}
	}
	uni.request(params);
}


export default req;
