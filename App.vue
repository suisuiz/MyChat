<script>
export default {
  data() {
    return {
      // websocket连接
      socketTask: null, // 云端
      socketTask2: null // 边缘端
    }
  },

  onLaunch() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  methods: {}
}
</script>

<style>
/* @import './common/uni-nvue.css'; */
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
/* @import './common/index.css'; */
@import '@/static/css/index.css';
/* #endif */
</style>
