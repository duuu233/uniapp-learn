<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout :navbarShow="false">
    <scroll-view scroll-y class="page-scroll aurora-bg">
      <view class="page-shell">
        <view class="profile-card app-card-elevated">
          <template v-if="hasLogin">
            <view class="profile-top">
              <image class="avatar" :src="userStore.userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
              <view class="profile-main">
                <view class="profile-name">{{ userStore.userInfo.realname || '微信用户' }}</view>
                <view class="profile-meta">{{ userStore.userInfo.phone || '138****1024' }}</view>
                <view class="profile-meta">ID：{{ userStore.userInfo.userid }}</view>
              </view>
            </view>
            <view class="profile-actions">
              <view class="pill-button" @click="syncProfile">同步微信头像昵称</view>
              <view class="pill-button" @click="openRoute(SCENARIO_ROUTES.profileInfo)">编辑资料</view>
            </view>
          </template>
          <template v-else>
            <view class="profile-name">微信绑定手机号快捷登录</view>
            <view class="profile-desc">当前小程序不提供注册页和退出登录页，登录即绑定为本地唯一操作者身份。</view>
            <button class="primary-button" open-type="getPhoneNumber" @getphonenumber="handlePhoneLogin">
              微信绑定手机号快捷登录
            </button>
          </template>
        </view>

        <view class="summary-grid">
          <view v-for="item in summaryCards" :key="item.label" class="summary-card app-card">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
          </view>
        </view>

        <view class="section app-card">
          <view class="section-title">核心入口</view>
          <view class="menu-list">
            <view v-for="item in primaryMenus" :key="item.title" class="menu-item" hover-class="menu-item--hover" @click="openRoute(item.url, item.isTab)">
              <view class="menu-main">
                <view class="menu-title">{{ item.title }}</view>
                <view class="menu-desc">{{ item.desc }}</view>
              </view>
              <text class="menu-arrow">›</text>
            </view>
          </view>
        </view>

        <view class="section app-card">
          <view class="section-title">更多功能</view>
          <view class="menu-list">
            <view v-for="item in secondaryMenus" :key="item.title" class="menu-item" hover-class="menu-item--hover" @click="openRoute(item.url, item.isTab)">
              <view class="menu-main">
                <view class="menu-title">{{ item.title }}</view>
                <view class="menu-desc">{{ item.desc }}</view>
              </view>
              <text class="menu-arrow">›</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useScenarioStore, useUserStore } from '@/store'
import { handleWechatPhoneQuickLogin, syncWechatProfileToStore } from '@/service/scenario/account'
import {
  SCENARIO_ROUTES,
  getAccessibleDevices,
  getCurrentScenarioUserId,
  getMyCastRecords,
  getMyPhotos,
} from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()
const redirectUrl = ref('')

const userId = computed(() => getCurrentScenarioUserId(userStore.userInfo.userid))
const hasLogin = computed(() => !!userStore.isLogined)
const myDevices = computed(() => getAccessibleDevices(scenarioStore.devices, userId.value))
const myPhotos = computed(() => getMyPhotos(scenarioStore.photos, userId.value))
const myRecords = computed(() => getMyCastRecords(scenarioStore.castRecords, userId.value))

const summaryCards = computed(() => [
  { label: '我的设备', value: `${myDevices.value.length}`, hint: '含所有者和使用者设备' },
  { label: '我的相册', value: `${myPhotos.value.length}`, hint: '仅记录成功投屏照片' },
  { label: '投屏记录', value: `${myRecords.value.length}`, hint: '成功和失败都会保留' },
])

const primaryMenus = [
  { title: '我的相册', desc: '多选删除、再次投屏', url: SCENARIO_ROUTES.albumCenter },
  { title: '我的设备', desc: '名称、权限、轮播和一键清空', url: SCENARIO_ROUTES.deviceHub, isTab: true },
  { title: '投屏管理', desc: '查看成功/失败记录并重投', url: SCENARIO_ROUTES.castCenter },
]

const secondaryMenus = [
  { title: '个人信息', desc: '昵称、头像、手机号和用户 ID', url: SCENARIO_ROUTES.profileInfo },
  { title: '设备定位', desc: '查看当前设备定位和轨迹', url: SCENARIO_ROUTES.miniLocation },
  { title: '操作指南', desc: '按设备类型查看帮助文档', url: SCENARIO_ROUTES.guideCenter },
  { title: '设置', desc: '关于我们、联系方式、隐私政策、用户协议', url: SCENARIO_ROUTES.settingsCenter },
]

function openRoute(url: string, isTab = false) {
  if (isTab) {
    uni.switchTab({ url })
    return
  }
  uni.navigateTo({ url })
}

function navigateAfterLogin() {
  if (!redirectUrl.value) return
  const target = decodeURIComponent(redirectUrl.value)
  redirectUrl.value = ''
  if (target === SCENARIO_ROUTES.home || target === SCENARIO_ROUTES.deviceHub || target === SCENARIO_ROUTES.people) {
    uni.switchTab({ url: target })
    return
  }
  uni.redirectTo({ url: target })
}

function handlePhoneLogin(event: Record<string, any>) {
  const result = handleWechatPhoneQuickLogin(event?.detail)
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
  if (result.success) {
    navigateAfterLogin()
  }
}

async function syncProfile() {
  try {
    await syncWechatProfileToStore()
    uni.showToast({ title: '微信头像昵称已同步', icon: 'success' })
  } catch {
    uni.showToast({ title: '你取消了微信资料授权', icon: 'none' })
  }
}

onLoad((options) => {
  redirectUrl.value = typeof options?.redirect === 'string' ? options.redirect : ''
})

onShow(() => {
  scenarioStore.bootstrap()
})
</script>

<style scoped lang="scss">
.profile-card,
.section {
  padding: 28rpx 24rpx;
}

.profile-card {
  background: var(--brand-grad-deep);
  color: var(--ink-on-brand);
}

.profile-top {
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 28rpx;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.12);
}

.profile-name {
  font-size: 21px;
  font-weight: 800;
}

.profile-meta,
.profile-desc {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.76);
}

.profile-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.pill-button {
  padding: 10rpx 18rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.12);
  font-size: 12px;
  font-weight: 700;
}

.primary-button {
  margin-top: 24rpx;
  border: none;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  color: var(--brand-700);
  font-size: 15px;
  font-weight: 700;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card {
  padding: 22rpx 18rpx;
}

.summary-label,
.summary-hint,
.menu-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.summary-value,
.section-title,
.menu-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.summary-value {
  margin-top: 10rpx;
}

.section-title {
  margin-bottom: 12rpx;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 20rpx 0;
}

.menu-item + .menu-item {
  border-top: 1rpx solid var(--hairline);
}

.menu-item--hover {
  opacity: 0.82;
}

.menu-main {
  flex: 1;
  min-width: 0;
}

.menu-desc {
  margin-top: 8rpx;
}

.menu-arrow {
  font-size: 20px;
  color: var(--ink-300);
}
</style>
