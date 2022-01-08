/*
 * @Descripttion: main.js
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-15 16:24:45
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-04-16 09:47:20
 * @FilePath: \things\main.js
 */

import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	...App
})
app.$mount()
