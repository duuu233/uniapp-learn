<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设备中心',
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
        <view class="hero">
          <view class="hero-glow" />
          <view class="hero-kicker">Device · Hub</view>
          <view class="hero-title">设备中心</view>
          <view class="hero-subtitle">设备管理、绑定、搜索、连接和状态时间线统一收口在这里。</view>
        </view>

        <view class="summary-grid">
          <view v-for="(item, i) in pageData.summary" :key="item.label" class="summary-card" :style="{ '--i': i }">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
          </view>
        </view>

        <view class="section">
          <view class="section-head">
            <view class="app-section-kicker">Shortcuts</view>
            <view class="section-title">快捷入口</view>
          </view>
          <view class="shortcut-list">
            <view
              v-for="item in pageData.shortcuts"
              :key="item.title"
              class="shortcut-card"
              hover-class="shortcut-card--hover"
              @click="openRoute(item.url)"
            >
              <view class="shortcut-body">
                <view class="shortcut-title">{{ item.title }}</view>
                <view class="shortcut-subtitle">{{ item.subtitle }}</view>
              </view>
              <view class="app-pill is-info">{{ item.badge }}</view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-head">
            <view class="app-section-kicker">Devices</view>
            <view class="section-title">设备列表</view>
          </view>
          <view class="device-list">
            <view v-for="item in pageData.devices" :key="item.id" class="device-card" hover-class="device-card--hover">
              <view class="device-top">
                <view class="device-id">
                  <view class="device-name">{{ item.name }}</view>
                  <view class="device-sn">{{ item.serialNumber }}</view>
                </view>
                <view :class="['app-pill', statusClass(item.status)]">
                  <view class="app-dot" />
                  <text>{{ item.status }}</text>
                </view>
              </view>
              <view class="device-meta">{{ item.location }}</view>
              <view class="device-stats">
                <view class="device-stat">
                  <view class="device-stat-label">信号</view>
                  <view class="device-stat-value">{{ item.signal }}</view>
                </view>
                <view class="device-stat-divider" />
                <view class="device-stat">
                  <view class="device-stat-label">电量</view>
                  <view class="device-stat-value">{{ item.battery }}</view>
                </view>
                <view class="device-stat-divider" />
                <view class="device-stat">
                  <view class="device-stat-label">最近</view>
                  <view class="device-stat-value">{{ item.lastSeen }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-head">
            <view class="app-section-kicker">Timeline</view>
            <view class="section-title">最新动态</view>
          </view>
          <view class="timeline-list">
            <view v-for="(item, i) in pageData.timeline" :key="`${item.time}-${item.title}`" class="timeline-item">
              <view class="timeline-rail">
                <view class="timeline-dot" />
                <view v-if="i < pageData.timeline.length - 1" class="timeline-line" />
              </view>
              <view class="timeline-main">
                <view class="timeline-time">{{ item.time }}</view>
                <view class="timeline-title">{{ item.title }}</view>
                <view class="timeline-description">{{ item.description }}</view>
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
import { getDeviceHubPageData, type DeviceHubPageData } from '@/service/scenario'

const pageData = ref<DeviceHubPageData | null>(null)

const openRoute = (url: string) => {
  uni.navigateTo({ url })
}

const statusClass = (status: string) => {
  if (status === '在线') return 'is-online'
  if (status === '待激活') return 'is-pending'
  return 'is-offline'
}

onLoad(async () => {
  pageData.value = await getDeviceHubPageData()
})
</script>

<style scoped lang="scss">
.page-shell {
  gap: 28rpx;
}

/* === Hero === */
.hero {
  position: relative;
  padding: 42rpx 36rpx 38rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-xl);
  background: var(--brand-grad-deep);
  color: var(--ink-on-brand);
  box-shadow: var(--brand-glow);
  overflow: hidden;
  animation: aurora-rise 0.5s ease both;
}

.hero-glow {
  position: absolute;
  top: -120rpx;
  right: -90rpx;
  width: 340rpx;
  height: 340rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 72%);
  pointer-events: none;
}

.hero-kicker {
  display: inline-block;
  padding: 6rpx 18rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  font-size: 11px;
  letter-spacing: 1.4rpx;
  font-weight: 700;
}

.hero-title {
  margin-top: 22rpx;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.4rpx;
}

.hero-subtitle {
  margin-top: 14rpx;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
  max-width: 92%;
}

/* === Summary === */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.summary-card {
  position: relative;
  padding: 28rpx 26rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-md);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  animation: aurora-rise 0.5s ease both;
  animation-delay: calc(60ms * var(--i, 0));
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6rpx;
  height: 72rpx;
  background: var(--brand-grad);
  border-radius: 0 4rpx 4rpx 0;
}

.summary-label {
  font-size: 12px;
  color: var(--ink-400);
  letter-spacing: 0.4rpx;
}

.summary-value {
  margin-top: 14rpx;
  font-size: 28px;
  font-weight: 800;
  color: var(--ink-900);
  letter-spacing: -0.6rpx;
  font-feature-settings: 'tnum';
}

.summary-hint {
  margin-top: 8rpx;
  font-size: 12px;
  color: var(--ink-400);
  line-height: 1.5;
}

/* === Section === */
.section {
  padding: 32rpx 28rpx 28rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.section-head {
  margin-bottom: 22rpx;
}

.section-title {
  margin-top: 10rpx;
  font-size: 18px;
  font-weight: 800;
  color: var(--ink-900);
  letter-spacing: -0.3rpx;
}

/* === Shortcuts === */
.shortcut-list,
.device-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.shortcut-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 22rpx 24rpx;
  border-radius: var(--r-md);
  background: linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%);
  border: 1rpx solid var(--hairline);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.shortcut-card--hover {
  transform: translateY(-2rpx);
  box-shadow: var(--shadow-sm);
}

.shortcut-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-900);
}

.shortcut-subtitle {
  margin-top: 8rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

/* === Device cards === */
.device-card {
  padding: 24rpx 24rpx 20rpx;
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1rpx solid var(--hairline);
  box-shadow: var(--shadow-xs);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.device-card--hover {
  transform: translateY(-2rpx);
  box-shadow: var(--shadow-sm);
}

.device-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}

.device-id {
  min-width: 0;
}

.device-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-900);
}

.device-sn {
  margin-top: 6rpx;
  font-size: 11px;
  color: var(--ink-300);
  letter-spacing: 0.4rpx;
  font-feature-settings: 'tnum';
}

.device-meta {
  margin-top: 14rpx;
  font-size: 12px;
  color: var(--ink-500);
  line-height: 1.6;
}

.device-stats {
  display: flex;
  align-items: stretch;
  margin-top: 18rpx;
  padding: 14rpx 0;
  border-top: 1rpx solid var(--hairline);
}

.device-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.device-stat-label {
  font-size: 11px;
  color: var(--ink-300);
  letter-spacing: 0.5rpx;
}

.device-stat-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-900);
  font-feature-settings: 'tnum';
}

.device-stat-divider {
  width: 1rpx;
  background: var(--hairline);
}

/* === Timeline === */
.timeline-list {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 22rpx;
  padding-bottom: 24rpx;
}

.timeline-rail {
  position: relative;
  width: 14rpx;
  flex-shrink: 0;
  padding-top: 6rpx;
}

.timeline-dot {
  position: relative;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: var(--brand-500);
  box-shadow: 0 0 0 4rpx rgba(49, 95, 203, 0.14);
  z-index: 1;
}

.timeline-line {
  position: absolute;
  top: 22rpx;
  left: 6rpx;
  bottom: -24rpx;
  width: 2rpx;
  background: linear-gradient(180deg, rgba(49, 95, 203, 0.28), rgba(49, 95, 203, 0.06));
}

.timeline-main {
  flex: 1;
  min-width: 0;
  padding-bottom: 4rpx;
}

.timeline-time {
  font-size: 11px;
  font-weight: 700;
  color: var(--brand-600);
  letter-spacing: 0.5rpx;
  font-feature-settings: 'tnum';
}

.timeline-title {
  margin-top: 6rpx;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-900);
}

.timeline-description {
  margin-top: 6rpx;
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink-400);
}
</style>
