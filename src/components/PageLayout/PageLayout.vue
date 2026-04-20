<template>
  <view class="pageLayout">
    <view
      v-if="navbarShow"
      :class="{ pageNav: true, transparent: navBgTransparent, fixed: navFixed }"
      :style="{ height: `${statusBarHeight + navHeight}px` }"
    >
      <view class="statusBar" :style="{ height: `${statusBarHeight}px` }"></view>
      <wd-navbar
        :bordered="false"
        :title="navTitle"
        :leftText="navLeftText"
        :leftArrow="navLeftArrow"
        :rightText="isMp ? '' : navRightText"
        @clickLeft="handleClickLeft"
        @clickRight="handleClickRight"
        :custom-class="getClass()"
      >
        <template v-if="isMp === false && $slots.navRight" #right>
          <slot name="navRight"></slot>
        </template>
        <template v-if="isMp" #left>
          <!-- 为了在小程序上美观 -->
          <template v-if="$slots.navRight && isShowNavRightTextMp">
            <view class="btnGroup">
              <view class="left" @click.stop="handleClickLeft">{{ navLeftText }}</view>
              <view class="right" @click.stop="() => emit('navRightMp')">{{ navRightTextMp }}</view>
            </view>
          </template>
          <template v-else-if="$slots.navLeft">
            <slot name="navLeft"></slot>
          </template>
          <template v-else>
            <view class="mpNavLeft" @click.stop="handleClickLeft">
              <wd-icon v-if="navLeftArrow" name="thin-arrow-left" size="14px"></wd-icon>
              <view>{{ navLeftText }}</view>
            </view>
          </template>
        </template>
      </wd-navbar>
    </view>
    <view class="pageContent">
      <view class="content">
        <slot></slot>
      </view>
      <!--微信中导航右侧的在这儿生成-->
      <view class="navRight" v-if="isMp && !$slots.navRight && mpNavRightIsBottom && navRightText">
        <wd-button @click="handleClickRight">{{ navRightText }}</wd-button>
      </view>
    </view>
    <view class="tabbar"></view>
  </view>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import { useRouter } from '@/plugin/uni-mini-router'
import { useParamsStore } from '@/store/page-params'
import { isMp } from '@/utils/platform'
// const isMp = true
defineOptions({
  name: 'pageLayout',
  options: {
    // apply-shared‌：当前页面样式会影响到子组件样式.(小程序)
    // shared‌：当前页面样式影响到子组件，子组件样式也会影响到当前页面.(小程序)
    styleIsolation: 'shared',
  },
})
const paramsStore = useParamsStore()
const router = useRouter()
const props = defineProps({
  backRouteName: {
    type: String,
    default: '',
  },
  backRoutePath: {
    type: String,
    default: '',
  },
  routeParams: {
    type: Object,
    default: () => {},
  },
  routeQuery: {
    type: Object,
    default: () => {},
  },
  routeMethod: {
    type: String,
    default: 'replace',
  },
  navbarShow: {
    type: Boolean,
    default: true,
  },
  navBgTransparent: {
    type: Boolean,
    default: false,
  },
  navFixed: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'page', // 'page','popup'
  },
  navTitle: {
    type: String,
    default: '',
  },
  navLeftText: {
    type: String,
    default: '返回',
  },
  navLeftArrow: {
    typeof: Boolean,
    default: true,
  },
  navRightText: {
    typeof: String,
    default: '',
  },
  // 当有右侧有slot时，在小程序上不显示slot，显示文字 (默认显示)
  isShowNavRightTextMp: {
    typeof: Boolean,
    default: true,
  },
  // 当有右侧有slot时，在小程序上不显示slot，显示文字
  navRightTextMp: {
    typeof: String,
    default: '确定',
  },
  // 右侧的文本在小程序端是否生成在页面底部（否：就得业务中自己写）
  mpNavRightIsBottom: {
    typeof: Boolean,
    default: true,
  },
})
const slot = useSlots()
const globalData = getApp().globalData
const { systemInfo, navHeight } = globalData
const { statusBarHeight } = systemInfo
const emit = defineEmits(['navBack', 'navRight', 'navRightMp'])
const handleClickLeft = () => {
  emit('navBack')
  // 只有在页面中才默认返回，弹层中不返回
  if (props.type === 'page') {
    const pages = getCurrentPages()
    if (props.backRouteName || props.backRoutePath) {
      const prevPage = pages[pages.length - 2]
      if (prevPage) {
        const route = prevPage.route
        const name = route.split('/').pop()
        if (route === props.backRoutePath || props.backRouteName === name) {
          router.back()
          clearPageParamsCache()
          return
        }
      }
      if (props.backRouteName) {
        router[props.routeMethod]({ name: props.backRouteName, params: props.routeParams })
        clearPageParamsCache()
      } else {
        router[props.routeMethod]({ name: props.backRoutePath, query: props.routeQuery })
        clearPageParamsCache()
      }
    } else {
      router.back()
      clearPageParamsCache()
    }
  }
}
const clearPageParamsCache = () => {
  // 清除页面传参缓存
  const pages = getCurrentPages()
  const curPage = pages[pages.length - 1]
  const curRoute = curPage.route
  const name = curRoute.split('/').pop()
  paramsStore.clearPageParams(name)
}
const handleClickRight = () => {
  emit('navRight')
}
const getClass = () => {
  const cls = `nav ${isMp ? 'mp' : ''} ${slot.navRight ? 'slot_navRight' : ''}`
  return cls
}
</script>

<style lang="scss" scoped>
.pageLayout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: var(--app-bg);

  .pageNav {
    border-bottom: 1rpx solid var(--hairline);
    background: rgba(248, 250, 252, 0.96);
    box-shadow: 0 8rpx 28rpx rgba(15, 23, 42, 0.04);

    &.transparent {
      border-bottom-color: transparent;
      background: transparent;
      box-shadow: none;
    }

    &.fixed {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
    }

    .statusBar {
      width: 100%;
      height: 0;
    }

    :deep(.wd-navbar) {
      background-color: transparent;
      --wot-navbar-color: var(--ink-900);
      --wot-navbar-desc-font-color: var(--ink-500);
      --wot-navbar-title-font-weight: 600;
      --wot-navbar-arrow-size: 18px;
      --wot-navbar-desc-font-size: 14px;
      --wot-navbar-title-font-size: 17px;
      color: var(--ink-900);

      .wd-navbar__title,
      .wd-navbar__left,
      .wd-navbar__right {
        color: inherit;
      }

      .wd-navbar__text {
        color: var(--ink-500);
      }

      &.mp {
        &.slot_navRight {
          padding-right: 90px;

          .wd-navbar__text {
            display: none;
          }

          .wd-navbar__content {
            display: flex;
          }

          .wd-navbar__left,
          .wd-navbar__title,
          .wd-navbar__right {
            position: static;
          }

          .wd-navbar__title {
            max-width: none;
          }
        }
      }
    }
  }
  .pageContent {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    background: var(--app-bg);

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
    }

    .navRight {
      display: flex;
      justify-content: flex-end;
      padding: 20rpx 24rpx 24rpx;
      margin-bottom: calc(constant(safe-area-inset-bottom));
      margin-bottom: calc(env(safe-area-inset-bottom));

      :deep(.wd-button) {
        --wot-button-medium-height: 44px;
        --wot-button-medium-fs: 14px;
        width: 100%;
        display: block;
        margin: 0 auto;
        border-radius: 18px;
        box-shadow: var(--shadow-sm);
      }
    }
  }

  .tabbar {
    /* #ifdef H5 */
    height: var(--window-bottom);
    /* #endif */
  }

  .btnGroup {
    display: flex;
    align-items: center;
    height: 56rpx;
    line-height: 56rpx;
    color: var(--brand-600);
    border: 1rpx solid rgba(49, 95, 203, 0.18);
    border-radius: 999px;
    background: rgba(49, 95, 203, 0.08);

    .left {
      border-right: 1rpx solid rgba(49, 95, 203, 0.16);
    }

    .left,
    .right {
      padding: 0 18rpx;
      font-size: 13px;
      font-weight: 600;
    }
  }

  .mpNavLeft {
    display: flex;
    align-items: center;
    gap: 8rpx;
    color: var(--ink-700);
    font-weight: 500;
  }
}
</style>
