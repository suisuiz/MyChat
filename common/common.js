/*
 * @Descripttion: 接口
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-21 16:46:24
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-12-22 18:03:34
 * @FilePath: \things\common\common.js
 */
module.exports = {
	// apiHost: "https://chorustek.com",
	apiHost: "https://zk.club077.com:8080",
	// apiHost: "https://192.168.1.199:8080",
	socketHost: "https://zk.club077.com:8443",
	// socketHost: "http://192.168.1.199:8443",

	json_add(a, b) {
		if (a == undefined || a.length == 0) return b;
		if (b == undefined || b.length == 0) return a;
		var s_a = JSON.stringify(a);
		var s_b = JSON.stringify(b);
		var c = s_a.substring(0, s_a.length - 1) + "," + s_b.substring(1);
		return JSON.parse(c);
	},
	goBack() {
		console.log(Router);
		this.$router.go(-1);
	},
	getToken() {
		return uni.getStorageSync("token");
	},
	setToken(token) {
		uni.setStorageSync("token", token);
	},
	setOpenid(openid) {
		uni.setStorageSync("openid", openid)
	},
	getOpenid(openid) {
		return uni.getStorageSync("openid")
	},

	showLoading() {
		uni.showLoading({
			title: '加载中',
			mask: true
		});
	},

	hideLoading() {
		uni.hideLoading();
	},

	showToast(str) {
		uni.showToast({
			icon: "none",
			title: str,
			mask: true
		});
	},

	// 未登录时请求
	requestNoLogin(apiPath, type, data, cb) {
		var that = this;
		uni.request({
			url: that.apiHost + apiPath,
			method: type,
			header: {
				"content-type": "application/json"
			},
			sslVerify: false,
			data: data,
			success(res) {
				if (res.statusCode == 200) {
					cb(res.data);
				} else {
					that.showToast('服务暂时不可用，请稍后重试');
				}
			},
			fail() {
				that.showToast('网络开小差了');
			}
		})
	},

	// 封装请求
	request(apiPath, type, data, cb, bol, newPath) {
		let that = this;
		// 获取 tokenObj
		let tokenObj = that.getToken();
		if (!tokenObj || !tokenObj.token) {
			that.setToken(null);
			uni.reLaunch({
				url: '/pages/user/login'
			});
			return;
		}

		let url;
		let localAddress = uni.getStorageSync('localAddress');
		// bol 判断云端还是边缘端  true  边缘端   false  云端
		if (bol) {
			// 边缘端如果是空,默认变云端
			if (localAddress == '') {
				url = that.apiHost + apiPath;
			} else {
				// console.log("边缘端")
				url = `https://${localAddress}:8080${apiPath}`;
			}
		} else {
			// console.log("云端")
			url = that.apiHost + apiPath;
		}

		if (newPath) {
			url = newPath
		}
		// console.log(url);
		var runRequest = (token) => {
			var token = token || tokenObj.token;
			uni.request({
				url: url,
				method: type,
				header: {
					'content-type': 'application/json',
					'token': token
				},
				sslVerify: false,
				data: data,
				timeout: 10000,
				success(res) {
					// console.log(res);
					if (res.statusCode == 200) {
						// console.log("res.data.code ==", res.data.code);
						// code=255 代表 token 过期，需要用 refresh_token 重新获取
						if (res.data.code == 255) {
							// 过期获取新 token
							that.refreshToken(tokenObj.refresh_token, bol, (res) => {
								// 重新执行接口
								runRequest(res.token);
							});
							return;
						} else {
							cb(res.data);
						}
					} else {
						// console.log("res.statusCode != 200");
						that.showToast('服务暂时不可用，请稍后重试');
					}
				},
				fail() {
					console.log("fail");
					// that.showToast('网络开小差了');
					cb({
						code: 'skulk away',
						message: '网络开小差了'
					})
				}
			})
		}
		runRequest();
	},

	// 封装文件请求
	fileRequest(apiPath, filepath, name, form, cb, newPath) {
		let that = this;
		// 获取 tokenObj
		let tokenObj = that.getToken();
		if (!tokenObj || !tokenObj.token) {
			that.setToken(null);
			uni.reLaunch({
				url: '/pages/user/login'
			});
			return;
		}

		let url;
		url = that.apiHost + apiPath
		if (newPath) {
			url = newPath
		}
		var runUpload = (token) => {
			var token = token || tokenObj.token;
			uni.uploadFile({
				url: url,
				filePath: filepath,
				name: name,
				formData: form,
				sslVerify: false,
				header: {
					'token': token
				},
				success(res) {
					// console.log(res)
					if (res.statusCode == 200) {
						res.data = JSON.parse(res.data)
						// code=255 代表 token 过期，需要用 refresh_token 重新获取
						if (res.data.code == 255) {
							// 初始化 token
							// that.setToken(null);
							// 过期获取新 token  false 云端
							that.refreshToken(tokenObj.refresh_token, false, (res) => {
								console.log('获取新token', res);
								// 重新执行接口
								runUpload(res.token);
							});
							return;
						} else {
							cb(res.data);
						}
					} else {
						that.showToast('服务暂时不可用，请稍后重试');
						// 过期获取新 token  false 云端
						that.refreshToken(tokenObj.refresh_token, false, (res) => {
							console.log('获取新token', res);
							// 重新执行接口
							runUpload(res.token);
						});
					}
				},
				fail() {
					let error = {
						code: 'skulk away',
						message: "网络开小差了"
					}
					cb(JSON.stringify(error))
				}
			})
		}
		runUpload();
	},

	// 用 refresh_token 获取新的 access_token
	refreshToken(refresh_token, bol, cb) {
		var that = this;

		// console.log(bol);
		let url;
		let localAddress = uni.getStorageSync('localAddress');
		// bol 判断云端还是边缘端  true  边缘端   false  云端
		if (bol) {
			// 边缘端如果是空,默认变云端
			if (localAddress == '') {
				url = `${that.apiHost}/user/refresh_token`;
			} else {
				url = `https://${localAddress}:8080/chat/refresh_token`;
			}
		} else {
			url = `${that.apiHost}/user/refresh_token`;
		}

		// console.log(refresh_token);
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
				// console.log('refreshToken====', res);
				if (res.statusCode == 200) {
					if (res.data.code != 0) {
						// 初始化 token、重新登录
						that.setToken(null);
						uni.reLaunch({
							url: '/pages/user/login',
						});
					} else {
						// 更新储存里的 token
						let tokenObj = {
							token: res.data.AccessToken,
							refresh_token: refresh_token
						}
						// console.log("token==", res.data.AccessToken);
						that.setToken(tokenObj);
						if (cb) {
							cb(tokenObj);
						}
					}
				} else {
					that.showToast('服务暂时不可用，请稍后重试');
				}
			}
		})
	},

	/******************************************** 基础接口 ********************************************/
	// 注册
	register(data, cb) {
		this.requestNoLogin("/user/register", "POST", data, (r) => {
			cb(r)
		})
	},

	// 短信验证码
	sendsms(data, cb) {
		this.requestNoLogin("/user/sendsms", "POST", data, (r) => {
			cb(r)
		})
	},

	// 登录
	login(data, cb) {
		this.requestNoLogin("/user/login", "POST", data, (r) => {
			cb(r)
		})
	},

	// 微信登录
	wx_login(data, cb) {
		this.requestNoLogin("/user/wx_login", "POST", data, (r) => {
			cb(r)
		})
	},

	// 微信登录
	wx_bdphone(data, cb) {
		this.requestNoLogin("/user/binding", "POST", data, (r) => {
			cb(r)
		})
	},

	// 退出登录
	logout(cb) {
		this.request("/user/logout", "POST", {}, (r) => {
			cb(r)
		})
	},

	// 上传头像
	upload_file(data, tempFilePath, cb) {
		this.fileRequest("/user/upload_file", tempFilePath, 'file', data, (r) => {
			cb(r)
		})
	},

	// 设置用户信息
	set_userinfo(data, cb) {
		this.request("/user/set_userinfo", "POST", data, (r) => {
			cb(r)
		})
	},

	// 设置运行位置
	set_run(data, cb) {
		this.request("/user/set_run", "POST", data, (r) => {
			cb(r)
		})
	},

	// 推送规则
	set_notify(data, cb) {
		this.request("/user/set_notify", "POST", data, (r) => {
			cb(r)
		})
	},

	// 获取用户信息--名字头像
	get_userinfo(data, cb) {
		this.request("/user/get_userinfo", "POST", data, (r) => {
			cb(r)
		})
	},


	// 服务、管理号上传头像
	upload_face(url, data, tempFilePath, cb) {
		this.fileRequest('', tempFilePath, 'file', data, (r) => {
			cb(r)
		}, `${url}/upload_face`)
	},


	// 播放文件 上传视频 接口
	upload_video(url, data, tempFilePath, cb) {
		this.fileRequest('', tempFilePath, 'file', data, (r) => {
			cb(r)
		}, `${url}/upload_video`)
	},


	/******************************************** contact接口 ********************************************/
	// 获取联系人
	contactList(data, cb) {
		this.request("/contact/list_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	contactList2(data, cb) {
		this.request("/contact/v2/list_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 获取卡片详情
	contactInfo(data, cb) {
		this.request("/contact/view_contact2", "POST", data, (r) => {
			cb(r)
		})
	},

	// 搜好友
	contactFind(data, cb) {
		this.request("/contact/find_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 添加联系人
	contactAdd(data, cb) {
		this.request("/contact/add_user_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 添加设备
	deviceContactAdd(data, cb) {
		this.request("/contact/add_device_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 添加群
	groupContactAdd(data, cb) {
		this.request("/contact/add_group_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 删除联系人
	contactDel(data, cb) {
		this.request("/contact/delete_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 新的朋友
	contactNew(cb) {
		this.request("/contact/new_contact", "POST", {}, (r) => {
			cb(r)
		})
	},

	// 接收朋友请求
	contactAgree(data, cb) {
		this.request("/contact/agree_add_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 转发 联系人、设备 名片
	contactShare(data, cb) {
		this.request("/contact/share_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 设置亲密联系人
	set_dear_contact(data, cb) {
		this.request("/contact/set_dear_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 取消亲密联系人
	del_dear_contact(data, cb) {
		this.request("/contact/del_dear_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 设置免打扰
	set_message_level(data, cb) {
		this.request("/contact/set_message_level", "POST", data, (r) => {
			cb(r)
		})
	},

	// 设置设备公开
	set_device_open(data, cb) {
		this.request("/contact/set_device_open", "POST", data, (r) => {
			cb(r)
		})
	},

	// 设备分享给人、群
	share_device(data, cb) {
		this.request("/contact/share_device", "POST", data, (r) => {
			cb(r)
		})
	},

	// 共享设备列表
	shared_device(data, cb) {
		this.request("/contact/shared_device", "POST", data, (r) => {
			cb(r)
		})
	},

	// 公开设备列表
	sharing_device(data, cb) {
		this.request("/contact/sharing_device", "POST", data, (r) => {
			cb(r)
		})
	},

	// 设备共享列表
	list_device_share(data, cb) {
		this.request("/contact/list_device_share", "POST", data, (r) => {
			cb(r)
		})
	},

	// 取消公开设备
	cancel_device_open(data, cb) {
		this.request("/contact/cancel_device_open", "POST", data, (r) => {
			cb(r)
		})
	},

	// 取消共享设备
	cancel_device_share(data, cb) {
		this.request("/contact/cancel_device_share", "POST", data, (r) => {
			cb(r)
		})
	},

	// 创建场所
	add_site_contact(data, cb) {
		this.request("/contact/add_site_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 删除场所
	del_site_contact(data, cb) {
		this.request("/contact/del_site_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 场所列表
	list_site_contact(data, cb) {
		this.request("/contact/list_site_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 场所运行群名单
	list_site_chat(data, cb) {
		this.request("/contact/list_site_chat", "POST", data, (r) => {
			cb(r)
		})
	},

	// 添加设备列表
	list_add_device(data, cb) {
		this.request("/contact/list_add_device", "POST", data, (r) => {
			cb(r)
		})
	},

	// 网关列表
	list_gateway(data, cb) {
		this.request("/contact/list_gateway", "POST", data, (r) => {
			cb(r)
		})
	},

	// 添加网关
	new_gateway(data, cb) {
		this.request("/contact/new_gateway", "POST", data, (r) => {
			cb(r)
		})
	},

	// 扫描添加设备
	scan_device(data, cb) {
		this.request("/contact/scan_device", "POST", data, (r) => {
			cb(r)
		})
	},

	// 添加设备（需要网关）
	add_gateway_device(data, cb) {
		this.request("/contact/add_gateway_device", "POST", data, (r) => {
			cb(r)
		})
	},

	// 搜索联系人、设备、群
	search(data, cb) {
		this.request("/contact/search", "POST", data, (r) => {
			cb(r)
		})
	},

	// 获取设备信息
	get_device_info(data, cb) {
		this.request("/contact/get_device_info", "POST", data, (r) => {
			cb(r)
		})
	},

	// 获取网关信息
	get_gateway_info(data, cb) {
		this.request("/contact/get_gateway_info", "POST", data, (r) => {
			cb(r)
		})
	},

	// 设备改名
	set_device_name(data, cb) {
		this.request("/contact/set_device_name", "POST", data, (r) => {
			cb(r)
		})
	},

	// 安装的应用列表
	list_installed_app(data, cb) {
		this.request("/contact/list_installed_app", "POST", data, (r) => {
			cb(r)
		})
	},

	// 添加应用到联系人
	add_app_contact(data, cb) {
		this.request("/contact/add_service_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// 关注服务号
	follow_service(data, cb) {
		this.request("/contact/follow_service", "POST", data, (r) => {
			cb(r)
		})
	},

	// 删除已安装的应用
	del_installed_app(data, cb) {
		this.request("/contact/del_installed_app", "POST", data, (r) => {
			cb(r)
		})
	},

	// 轻应用和工作流列表
	list_all_appstore(data, cb) {
		this.request("/contact/list_all_appstore", "POST", data, (r) => {
			cb(r)
		})
	},

	// 安装轻应用和工作流
	install_app(data, cb) {
		this.request("/contact/install_app", "POST", data, (r) => {
			cb(r)
		})
	},

	// 轻应用和工作流详情
	view_app(data, cb) {
		this.request("/contact/view_app", "POST", data, (r) => {
			cb(r)
		})
	},

	// 搜索app
	find_app(data, cb) {
		this.request("/contact/find_app", "POST", data, (r) => {
			cb(r)
		})
	},

	// 获取 服务列表  服务号和管理号
	serviceList(data, cb) {
		this.request("/contact/v2/service_list", "POST", data, (r) => {
			cb(r)
		})
	},

	// 服务号和管理号 取消关注
	cancelFollow(data, cb) {
		this.request("/contact/cancel_follow", "POST", data, (r) => {
			cb(r)
		})
	},

	// 扫描添加联系人、设备、群
	scanContact(data, cb) {
		this.request("/contact/v2/scan_contact", "POST", data, (r) => {
			cb(r)
		})
	},



	/******************************************** chat接口 ********************************************/
	// 聊天室-发消息
	sendMessage(data, bol, cb) {
		this.request("/chat/sendMessage", "POST", data, (r) => {
			cb(r)
		}, bol)
	},

	// 文件上传
	chat_uploadFile(data, tempFilePath, cb) {
		this.fileRequest("/chat/uploadFile", tempFilePath, 'file', data, (r) => {
			cb(r)
		})
	},

	// 聊天室-欢迎语
	chatWelcome(data, bol, cb) {
		this.request("/chat/welcome", "POST", data, (r) => {
			cb(r)
		}, bol)
	},


	/******************************************** group接口 ********************************************/
	// 建群
	createGroup(data, cb) {
		this.request("/group/create_group", "POST", data, (r) => {
			cb(r)
		})
	},

	// 群聊详情
	groupInfo(data, cb) {
		this.request("/group/view_group", "POST", data, (r) => {
			cb(r)
		})
	},

	// 退出群
	quit_member(data, cb) {
		this.request("/group/quit_member", "POST", data, (r) => {
			cb(r)
		})
	},

	// 解散群
	dismiss_group(data, cb) {
		this.request("/group/dismiss_group", "POST", data, (r) => {
			cb(r)
		})
	},

	// 可进群列表
	addable_member(data, cb) {
		this.request("/group/addable_member", "POST", data, (r) => {
			cb(r)
		})
	},

	// 可删除列表
	deletable_member(data, cb) {
		this.request("/group/deletable_member", "POST", data, (r) => {
			cb(r)
		})
	},

	// 群拉人
	add_member(data, cb) {
		this.request("/group/add_member", "POST", data, (r) => {
			cb(r)
		})
	},

	// 群删人
	delete_member(data, cb) {
		this.request("/group/delete_member", "POST", data, (r) => {
			cb(r)
		})
	},

	// 轻应用列表
	find_softbot(data, cb) {
		this.request("/group/find_softbot", "POST", data, (r) => {
			cb(r)
		})
	},

	// 设置群运行位置
	set_group_run(data, cb) {
		this.request("/group/set_group_run", "POST", data, (r) => {
			cb(r)
		})
	},

	// 修改群名称
	set_group_name(data, cb) {
		this.request("/group/set_group_name", "POST", data, (r) => {
			cb(r)
		})
	},

	// 获取成员列表
	get_member(data, cb) {
		this.request("/group/v2/get_member", "POST", data, (r) => {
			cb(r)
		})
	},

	// 添加成员
	chat_add_member(url, data, cb) {
		this.request("", "POST", data, (r) => {
			cb(r)
		}, '', `${url}/add_member`)
	},

	// 添加成员
	add_person_member(url, data, cb) {
		this.request("", "POST", data, (r) => {
			cb(r)
		}, '', `${url}/add_person_member`)
	},


	// ----------------------------------------------------------------------------------------------------------------- //
	// // 聊天室-历史
	// chatHistory(data, cb) {
	// 	this.request("/zk/history", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// // 收藏文档
	// favorite(data, cb) {
	// 	this.request("/zk/favorite", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// // 收藏列表
	// favorited(data, cb) {
	// 	this.request("/zk/favorites", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// // 改设备状态
	// device_state(data, cb) {
	// 	this.request("/zk/device_state", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// // 改灯亮度
	// device_brightness(data, cb) {
	// 	this.request("/zk/device_brightness", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// // 设备分享
	// device_share(data, cb) {
	// 	this.request("/zk/share", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// 视频推流-开始结束
	device_object(data, cb) {
		this.request("/zk/device_object", "POST", data, (r) => {
			cb(r)
		})
	},

	// NFC添加联系人
	add_contact(data, cb) {
		this.request("/zk/add_contact", "POST", data, (r) => {
			cb(r)
		})
	},

	// // 工业质检-开关
	// device_light(data, cb) {
	// 	this.request("/zk/device_light", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// // 工业质检-转盘
	// device_motor(data, cb) {
	// 	this.request("/zk/device_motor", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// // 机器人-唤起APP获取工业质检信息
	// industrial_enter(data, cb) {
	// 	this.request("/zk/industrial_enter", "POST", data, (r) => {
	// 		cb(r)
	// 	})
	// },

	// // 工业质检-JSON
	// industrial_json(cb) {
	// 	this.request("/demo/industrial.json", "GET", {}, (r) => {
	// 		cb(r)
	// 	})
	// },


	// 扫描设备
	find_device(gatewayid, cb) {
		this.request(`/discover-${gatewayid}/scan`, "POST", {}, (r) => {
			cb(r)
		})
	},

}