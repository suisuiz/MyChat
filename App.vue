<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			
			uni.getSystemInfo({
				success(res) {
					console.log(res);
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
/* APP-NVUE 不编译，其他编译 */
/* #ifndef APP-NVUE */
@import '@/static/css/uni.css';
/* #endif */

@import '@/static/css/uni-nvue.css';

/* 仅 MP-TOUTIAO 编译 */
/* #ifdef MP-TOUTIAO */
@font-face {
  font-family: uniicons;
  src: url('/static/uni.ttf');
}

/* #endif */

/* APP-NVUE 不编译，其他编译 */
/* #ifndef APP-NVUE */
@import '@/static/css/index.css';
/* #endif */

</style>
