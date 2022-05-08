/*
 * @Descripttion: main.js
 * @Author: SUI
 * @LastEditTime: 2022-05-08 11:48:29
 * @FilePath: \MyChat\main.js
 */

import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	...App
})
app.$mount()