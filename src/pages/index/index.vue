<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
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
          <view class="hero-kicker">需求清单 · 落地版</view>
          <view class="hero-title">{{ pageData.heroTitle }}</view>
          <view class="hero-subtitle">{{ pageData.heroSubtitle }}</view>
          <view class="hero-footer">
            <text class="hero-version">{{ pageData.versionText }}</text>
            <view class="hero-button" hover-class="hero-button--hover" @click="openRoute(SCENARIO_ROUTES.deviceHub, true)">
              <text>查看设备中心</text>
              <text class="hero-button-arrow">→</text>
            </view>
          </view>
        </view>

        <view class="summary-grid">
          <view v-for="(item, i) in pageData.summary" :key="item.label" class="summary-card" :style="{ '--i': i }">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
            <view class="summary-spark" />
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <view>
              <view class="app-section-kicker">Capabilities</view>
              <view class="section-title">首页能力入口</view>
              <view class="section-desc">按需求清单补齐静态页面和对应的接口占位。</view>
            </view>
          </view>
          <view class="action-list">
            <view
              v-for="item in pageData.capabilities"
              :key="item.title"
              class="action-card"
              hover-class="action-card--hover"
              @click="openRoute(item.url, item.isTab)"
            >
              <view class="action-bar" />
              <view class="action-body">
                <view class="action-top">
                  <view class="action-title">{{ item.title }}</view>
                  <view class="app-pill is-info">{{ item.badge }}</view>
                </view>
                <view class="action-subtitle">{{ item.subtitle }}</view>
              </view>
              <text class="action-chevron">›</text>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <view>
              <view class="app-section-kicker">Devices</view>
              <view class="section-title">最近设备</view>
              <view class="section-desc">这里预留为设备概览和后续状态刷新入口。</view>
            </view>
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
              <view class="device-meta">
                <text class="device-meta-key">位置</text>
                <text class="device-meta-value">{{ item.location }}</text>
              </view>
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
              <view class="tag-list">
                <text v-for="tag in item.tags" :key="tag" class="tag">#{{ tag }}</text>
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
import { SCENARIO_ROUTES, getDashboardPageData, type DashboardPageData } from '@/service/scenario'

const pageData = ref<DashboardPageData | null>(null)

const openRoute = (url: string, isTab = false) => {
  if (isTab) {
    uni.switchTab({ url })
    return
  }

  uni.navigateTo({ url })
}

const statusClass = (status: string) => {
  if (status === '在线') return 'is-online'
  if (status === '待激活') return 'is-pending'
  return 'is-offline'
}

onLoad(async () => {
  pageData.value = await getDashboardPageData()
})
</script>

<style scoped lang="scss">
.page-scroll {
  /* aurora-bg utility from global stylesheet handles the background */
}

.page-shell {
  gap: 28rpx;
}

/* === Hero === */
.hero {
  position: relative;
  padding: 42rpx 36rpx 34rpx;
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
  top: -110rpx;
  right: -80rpx;
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 72%);
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
  line-height: 1.25;
  letter-spacing: -0.4rpx;
}

.hero-subtitle {
  margin-top: 14rpx;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
  max-width: 92%;
}

.hero-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 36rpx;
  font-size: 12px;
}

.hero-version {
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.4rpx;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 16rpx 24rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.96);
  color: var(--brand-700);
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.2);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.hero-button--hover {
  transform: translateY(-2rpx);
  box-shadow: 0 16rpx 28rpx rgba(15, 23, 42, 0.18);
}

.hero-button-arrow {
  font-size: 14px;
  font-weight: 700;
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
  font-size: 30px;
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

.summary-spark {
  position: absolute;
  right: 18rpx;
  bottom: 18rpx;
  width: 80rpx;
  height: 32rpx;
  border-radius: var(--r-xs);
  background: linear-gradient(135deg, rgba(49, 95, 203, 0.1), rgba(49, 95, 203, 0));
}

/* === Section === */
.section {
  padding: 32rpx 28rpx 28rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.section-header {
  margin-bottom: 22rpx;
}

.section-title {
  margin-top: 10rpx;
  font-size: 18px;
  font-weight: 800;
  color: var(--ink-900);
  letter-spacing: -0.3rpx;
}

.section-desc {
  margin-top: 6rpx;
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink-400);
}

/* === Action cards === */
.action-list,
.device-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.action-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 22rpx 22rpx 22rpx 26rpx;
  border-radius: var(--r-md);
  background: linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%);
  border: 1rpx solid var(--hairline);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.action-card--hover {
  transform: translateY(-2rpx);
  box-shadow: var(--shadow-sm);
}

.action-bar {
  width: 6rpx;
  align-self: stretch;
  border-radius: var(--r-pill);
  background: var(--brand-grad);
  flex-shrink: 0;
}

.action-body {
  flex: 1;
  min-width: 0;
}

.action-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.action-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-900);
}

.action-subtitle {
  margin-top: 8rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.action-chevron {
  font-size: 28rpx;
  color: var(--ink-300);
  font-weight: 600;
  line-height: 1;
}

/* === Device cards === */
.device-card {
  padding: 26rpx 26rpx 22rpx;
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1rpx solid var(--hairline);
  box-shadow: var(--shadow-xs);
  transition: box-shadow 0.18s ease, transform 0.18s ease;
}

.device-card--hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-2rpx);
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
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 18rpx;
  font-size: 12px;
}

.device-meta-key {
  color: var(--ink-300);
}

.device-meta-value {
  color: var(--ink-700);
  font-weight: 500;
}

.device-stats {
  display: flex;
  align-items: stretch;
  margin-top: 20rpx;
  padding: 16rpx 0;
  border-top: 1rpx solid var(--hairline);
  border-bottom: 1rpx solid var(--hairline);
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

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 18rpx;
}

.tag {
  padding: 6rpx 14rpx;
  border-radius: var(--r-pill);
  background: linear-gradient(180deg, #f4f7fb 0%, #edf3ff 100%);
  font-size: 11px;
  color: var(--brand-700);
  font-weight: 600;
}
</style>
