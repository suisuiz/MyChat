let log = require('@/common/log.js')

class Websocket {
	constructor(ip) {
		this.ip = ip;
		this.socketTask = null;
		this.pingTimeout = 30000;
		this.pongTimeout = 5000;
		this.reconnectTimeout = 5000;
		this.loginTimeout = 2000;
		this.loginok = false;
		this.onClose = () => {};
		this.onError = () => {};
		this.onOpen = () => {
			let token = this.getToken().token
			let login = {
				cmd: 'login',
				seq: this.sendId(),
				data: {
					token: token
				}
			}
			log.writeFile(JSON.stringify(login))
			this.socketTask.send({
				data: JSON.stringify(login),
				success() {
					// console.log("连接成功");
				}
			})
		};
		this.onMessage = (event) => {
			let data = JSON.parse(event.data)
			if (data.cmd == "login") {
				log.writeFile(JSON.stringify(data))
				let code = data.response.code
				if (code == 0) {
					this.loginok = true
					this.onLogin(data.response.data)
					this.loginReset()
					this.heartCheck();
				} else if (code == 255) {
					// token expire
					this.refreshToken()
				} else {
					// invalid

				}
			} else {
				if (data.cmd == "msg") {
					log.writeFile(JSON.stringify(data))
					this.onChat(data)
				} else if (data.cmd == "notify") {
					log.writeFile(JSON.stringify(data))
					this.onNotify(data)
				}
				this.heartCheck()
			}
		};
		this.onReconnect = () => {};
		this.onLogin = (data) => {};
		this.onChat = (data) => {};
		this.onNotify = (data) => {};

		this.createWebSocket();
	}

	randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	sendId() {
		let timeStamp = new Date().getTime();
		let randId = this.randomNumber(100000, 999999);
		let id = timeStamp + "-" + randId;
		return id;
	}

	refreshToken() {
		var that = this;
		let ip = that.ip
		let url = `https://${ip}:8080/chat/refresh_token`;

		let refresh_token = this.getToken().refresh_token
		uni.request({
			url: url,
			method: "POST",
			header: {
				'content-type': 'application/json'
			},
			sslVerify: false,
			data: {
				refresh_code: refresh_token
			},
			success(res) {
				if (res.statusCode == 200) {
					log.writeFile("refreshToken" + JSON.stringify(res.data))
					if (res.data.code == 0) {
						let tokenObj = {
							token: res.data.AccessToken,
							refresh_token: refresh_token
						}
						that.setToken(tokenObj);
					}
				}
			}
		})
	}

	getToken() {
		return uni.getStorageSync("token");
	}

	setToken(token) {
		uni.setStorageSync("token", token);
	}

	createWebSocket() {
		let that = this
		let ip = this.ip
		this.loginok = false
		let url = `https://${ip}:8443/ws`;
		log.writeFile(url)
		this.socketTask = uni.connectSocket({
			url: url,
			complete: () => {
				that.registerEvent();
			}
		});
	}

	//注册心跳和钩子函数
	registerEvent() {
		let that = this
		this.socketTask.onClose(() => {
			log.writeFile("onClose")
			this.onClose();
			this.reconnect();
		});
		this.socketTask.onError(() => {
			log.writeFile("onError")
			this.onError();
			this.reconnect();
		});
		this.socketTask.onOpen(() => {
			log.writeFile("onOpen")
			this.onOpen();
			this.loginCheck();
		});
		this.socketTask.onMessage((event) => {
			this.onMessage(event);
		});
	}

	reconnect() {
		if (this.lockReconnect || this.forbidReconnect) return;
		this.lockReconnect = true;
		this.onReconnect();
		setTimeout(() => {
			this.createWebSocket();
			this.lockReconnect = false;
		}, this.reconnectTimeout);
	}

	send(msg) {
		this.socketTask.send(msg);
	}

	heartCheck() {
		this.heartReset();
		this.heartStart();
	}

	loginCheck() {
		this.loginReset();
		this.loginStart();
	}

	heartStart() {
		if (this.forbidReconnect) return;
		this.pingTimeoutId = setTimeout(() => {
			let heartbeat = {
				cmd: 'heartbeat',
				seq: this.sendId()
			}
			this.send({
				data: JSON.stringify(heartbeat),
			});
			this.pongTimeoutId = setTimeout(() => {
				this.socketTask.close();
			}, this.pongTimeout);
		}, this.pingTimeout);
	}

	heartReset() {
		clearTimeout(this.pingTimeoutId);
		clearTimeout(this.pongTimeoutId);
	}

	loginReset() {
		clearTimeout(this.loginTimeoutId);
	}

	loginStart() {
		if (this.forbidReconnect) return;
		this.loginTimeoutId = setTimeout(() => {
			this.socketTask.close();
		}, this.loginTimeout);
	}

	close() {
		this.forbidReconnect = true;
		this.heartReset();
		this.socketTask.close({
			success(res) {
				log.writeFile("关闭成功", res);
			},
			fail(err) {
				log.writeFile("关闭失败", err);
			},
		});
	}
}

module.exports = Websocket;