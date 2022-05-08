/*
 * @Descripttion: 
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 11:50:21
 * @FilePath: \MyChat\common\util.js
 */


// 时间戳转年月日
function formatDate(data) {
	let now = new Date(data);
	var year = now.getFullYear(); //取得4位数的年份
	var month = now.getMonth() + 1 < 10 ? ('0' + (now.getMonth() + 1)) : now.getMonth() + 1;
	var date = now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate();
	var hour = now.getHours() < 10 ? ('0' + now.getHours()) : now.getHours();
	var minute = now.getMinutes() < 10 ? ('0' + now.getMinutes()) : now.getMinutes();
	var second = now.getSeconds() < 10 ? ('0' + now.getSeconds()) : now.getSeconds();
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

// 生成随机数
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// 生成序列号
function sendId() {
	let timeStamp = new Date().getTime();
	let randId = randomNumber(100000, 999999);
	let id = timeStamp + "-" + randId;
	return id;
}

// 历史时间显示
function getTimeText(argument) {
	var timeS = argument;
	var todayT = ''; //
	var yestodayT = '';
	var timeCha = getTimeS(timeS);
	timeS = timeS.slice(-8);
	todayT = new Date().getHours() * 60 * 60 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() *
		1000;
	yestodayT = todayT + 24 * 60 * 60 * 1000;
	if (timeCha > yestodayT) {
		return argument.slice(0, 11).slice(5);
	}
	if (timeCha > todayT && timeCha < yestodayT) {
		// return timeS.slice(0, 2) > 12 ? '昨天 下午' + (timeS.slice(0, 2) == 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2, 5) : '昨天 上午' + timeS.slice(0, 5);
		return '昨天';
	}
	if (timeCha < todayT) {
		return timeS.slice(0, 2) >= 12 ? '下午' + (timeS.slice(0, 2) == 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2,
			5) : '上午' + timeS.slice(0, 5);
	}
}

// 时间戳获取
function getTimeS(timeS) {
	// var timeS = argument;
	timeS = timeS.replace(/[-]/g, '/');
	return new Date().getTime() - new Date(timeS).getTime() - 1000; //有一秒的误差
}

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
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
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = (number) => {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	},

};

module.exports = {
	formatDate: formatDate,
	randomNumber: randomNumber,
	sendId: sendId,
	getTimeText: getTimeText,
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils
}