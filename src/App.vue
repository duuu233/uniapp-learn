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
  color: var(--ink-700);
  font-family:
    'SF Pro Text',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    'Noto Sans CJK SC',
    sans-serif;
  background: var(--app-bg);
  -webkit-font-smoothing: antialiased;
}

page,
view,
text,
button,
input,
textarea,
scroll-view,
swiper,
image {
  box-sizing: border-box;
}

uni-page-body {
  height: 100%;
  background: var(--app-bg);

  & > uni-view {
    height: 100%;
  }
}

.shadow-warp {
  position: relative;
  box-shadow: var(--shadow-sm);
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
