function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

//*

/**
 * @alias 时间差转换
 * @param {Number} timestamp 编码前的中文字符串
 * @return 返回转换后的字符串
 * @description 将时间转换为与当前时间的时差的中文描述语
 * @example timestampToTime(new Date().getTime() - 2000) 返回 "2秒前"
 */
function timestampToTime(timestamp) {
	var mistiming = Math.round(new Date() / 1000) - timestamp / 1000;
	var postfix = mistiming > 0 ? '前' : '后'
	mistiming = Math.abs(mistiming)
	var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
	var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

	for (var i = 0; i < 7; i++) {
		var inm = Math.floor(mistiming / arrn[i])
		if (inm != 0) {
			return inm + arrr[i] + postfix
		}
	}
}

/**
 * @alias 计算角度
 * @param {Number} lat1 坐标点1的纬度
 * @param {Number} lng1 坐标点1的经度
 * @param {Number} lat2 坐标点2的纬度
 * @param {Number} lng2 坐标点2的经度
 * @description 二维坐标系统中，图标位于Y轴上，指向Y轴负方向，图标要旋转至2个
 * @return {String} 返回顺时针旋转的角度值
 */
function computeAngle(lat1, lng1, lat2, lng2) {
	var angle = Math.atan2(lat2 - lat1, lng2 - lng1) / (Math.PI / 180),
		result;
	if (angle > -180 && angle <= -90) {
		result = Math.abs(angle) - 90;
	} else if (angle > -90 && angle <= 0) {
		result = 270 + Math.abs(angle);
	}
	if (angle > 0 && angle <= 90) {
		result = 180 + 90 - angle;
	} else {
		result = 90 + 180 - angle;
	}
	return result;
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

/**
 * @alias 中文转Unicode编码
 * @param {String} str 编码前的中文字符串
 * @return 返回编码后的字符串
 * @example encodeUnicode('您好') 返回 "\\u60a8\\u597d"
 */
function encodeUnicode(str) {
	var res = [];
	for (var i = 0; i < str.length; i++) {
		res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
	}
	return "\\u" + res.join("\\u");
}

var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

module.exports = {
	formatTime,
	formatLocation,
	dateUtils,
	computeAngle,
	timestampToTime,
	encodeUnicode
}
