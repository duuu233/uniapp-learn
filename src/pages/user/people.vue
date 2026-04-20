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
      <view v-if="pageData" class="page-shell">
        <view class="profile-card">
          <view class="profile-glow" />
          <view class="profile-row">
            <view class="avatar">
              <text class="avatar-text">{{ pageData.profile.name.slice(0, 1) }}</text>
              <view class="avatar-ring" />
            </view>
            <view class="profile-body">
              <view class="profile-name">{{ pageData.profile.name }}</view>
              <view class="profile-role">{{ pageData.profile.role }} · {{ pageData.profile.company }}</view>
            </view>
          </view>
          <view class="profile-slogan">"{{ pageData.profile.slogan }}"</view>
        </view>

        <view v-for="group in pageData.menuGroups" :key="group.title" class="section">
          <view class="section-head">
            <view class="section-title">{{ group.title }}</view>
          </view>
          <view class="menu-list">
            <view
              v-for="item in group.items"
              :key="item.title"
              class="menu-item"
              hover-class="menu-item--hover"
              @click="openRoute(item.url, item.isTab)"
            >
              <view class="menu-main">
                <view class="menu-title">{{ item.title }}</view>
                <view class="menu-subtitle">{{ item.subtitle }}</view>
              </view>
              <view class="menu-right">
                <view v-if="item.badge" class="app-pill is-info">{{ item.badge }}</view>
                <text class="menu-chevron">›</text>
              </view>
            </view>
          </view>
        </view>

        <ApiDraftPanel :items="pageData.requestDrafts" />
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ApiDraftPanel from '@/components/scenario/ApiDraftPanel.vue'
import { getMyCenterPageData, type MyCenterPageData } from '@/service/scenario'

const pageData = ref<MyCenterPageData | null>(null)

const openRoute = (url: string, isTab = false) => {
  if (isTab) {
    uni.switchTab({ url })
    return
  }

  uni.navigateTo({ url })
}

onLoad(async () => {
  pageData.value = await getMyCenterPageData()
})
</script>

<style scoped lang="scss">
.page-shell {
  gap: 28rpx;
}

/* === Profile === */
.profile-card {
  position: relative;
  padding: 40rpx 36rpx 30rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-xl);
  background: var(--brand-grad-deep);
  color: var(--ink-on-brand);
  box-shadow: var(--brand-glow);
  overflow: hidden;
  animation: aurora-rise 0.5s ease both;
}

.profile-glow {
  position: absolute;
  top: -110rpx;
  right: -90rpx;
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 72%);
  pointer-events: none;
}

.profile-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  position: relative;
}

.avatar {
  position: relative;
  width: 112rpx;
  height: 112rpx;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 38rpx;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5rpx;
}

.avatar-ring {
  position: absolute;
  inset: -4rpx;
  border-radius: calc(var(--r-md) + 4rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.28);
  pointer-events: none;
}

.profile-name {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.3rpx;
}

.profile-role {
  margin-top: 8rpx;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.76);
  letter-spacing: 0.3rpx;
}

.profile-slogan {
  margin-top: 28rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.14);
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.88);
  font-style: italic;
}

/* === Section === */
.section {
  padding: 28rpx 24rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.section-head {
  padding: 4rpx 8rpx 18rpx;
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
  letter-spacing: -0.2rpx;
}

/* === Menu === */
.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 22rpx 16rpx;
  border-radius: var(--r-sm);
  transition: background 0.18s ease, transform 0.18s ease;
  position: relative;
}

.menu-item + .menu-item {
  border-top: 1rpx solid var(--hairline);
}

.menu-item--hover {
  background: var(--surface-muted);
  transform: translateX(2rpx);
}

.menu-main {
  flex: 1;
  min-width: 0;
}

.menu-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-900);
}

.menu-subtitle {
  margin-top: 8rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 14rpx;
  flex-shrink: 0;
}

.menu-chevron {
  font-size: 32rpx;
  color: var(--ink-300);
  font-weight: 600;
  line-height: 1;
}
</style>
