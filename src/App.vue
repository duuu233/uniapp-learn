<script lang="ts">
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
// #ifdef APP-PLUS
import appUpdate from '@/common/appUpdate'
// #endif

export default {
  onLaunch(options) {
    console.log('App Launch')
    console.log('应用启动路径:', options.path)
    // #ifdef APP-PLUS
    appUpdate()
    // #endif
  },
  onShow(options) {
    console.log('App Show')
    console.log('应用启动路径:', options.path)
  },
  onHide() {
    console.log('App Hide')
  },
  globalData: {
    isLocalConfig: true,
    systemInfo: uni.getSystemInfoSync(),
    navHeight: 44,
  },
}
</script>

<style lang="scss">
:root,
page {
  font-size: 14px;
  color: #333333;
  font-family:
    Helvetica Neue,
    Helvetica,
    sans-serif;
}

uni-page-body {
  height: 100%;

  & > uni-view {
    height: 100%;
  }
}

.shadow-warp {
  position: relative;
  box-shadow: 0 0 5px rgba(168, 92, 92, 0.1);
}

/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
