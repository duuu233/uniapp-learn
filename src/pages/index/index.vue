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
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="hero">
          <view class="hero-kicker">需求清单落地版</view>
          <view class="hero-title">{{ pageData.heroTitle }}</view>
          <view class="hero-subtitle">{{ pageData.heroSubtitle }}</view>
          <view class="hero-footer">
            <text>{{ pageData.versionText }}</text>
            <view class="hero-button" @click="openRoute(SCENARIO_ROUTES.deviceHub, true)">查看设备中心</view>
          </view>
        </view>

        <view class="summary-grid">
          <view v-for="item in pageData.summary" :key="item.label" class="summary-card">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <view class="section-title">首页能力入口</view>
            <view class="section-desc">按需求清单补齐静态页面和对应的接口占位。</view>
          </view>
          <view class="action-list">
            <view
              v-for="item in pageData.capabilities"
              :key="item.title"
              class="action-card"
              @click="openRoute(item.url, item.isTab)"
            >
              <view class="action-top">
                <view class="action-title">{{ item.title }}</view>
                <view class="action-badge">{{ item.badge }}</view>
              </view>
              <view class="action-subtitle">{{ item.subtitle }}</view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <view class="section-title">最近设备</view>
            <view class="section-desc">这里预留为设备概览和后续状态刷新入口。</view>
          </view>
          <view class="device-list">
            <view v-for="item in pageData.devices" :key="item.id" class="device-card">
              <view class="device-top">
                <view>
                  <view class="device-name">{{ item.name }}</view>
                  <view class="device-sn">{{ item.serialNumber }}</view>
                </view>
                <view :class="['device-status', statusClass(item.status)]">{{ item.status }}</view>
              </view>
              <view class="device-meta">位置：{{ item.location }}</view>
              <view class="device-meta">信号：{{ item.signal }} · 电量：{{ item.battery }} · 最近：{{ item.lastSeen }}</view>
              <view class="tag-list">
                <text v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</text>
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
  if (status === '在线') return 'online'
  if (status === '待激活') return 'pending'
  return 'offline'
}

onLoad(async () => {
  pageData.value = await getDashboardPageData()
})
</script>

<style scoped lang="scss">
.page-scroll {
  background: linear-gradient(180deg, #eef4ff 0%, #f5f7fb 45%, #eef2f7 100%);
}

.page-shell {
  padding: 18px 16px 28px;
}

.hero {
  padding: 22px 20px;
  border-radius: 24px;
  background: linear-gradient(135deg, #1f6fff, #4f8dff 65%, #8bb3ff);
  color: #fff;
  box-shadow: 0 18px 36px rgba(31, 111, 255, 0.2);
}

.hero-kicker {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 12px;
}

.hero-title {
  margin-top: 14px;
  font-size: 24px;
  font-weight: 700;
}

.hero-subtitle {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.7;
  opacity: 0.92;
}

.hero-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  font-size: 12px;
}

.hero-button {
  padding: 8px 14px;
  border-radius: 999px;
  background: #fff;
  color: #1f6fff;
  font-weight: 600;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.summary-card,
.action-card,
.device-card,
.section {
  border-radius: 20px;
  background: #fff;
}

.summary-card {
  padding: 16px;
}

.summary-label,
.section-desc,
.summary-hint,
.action-subtitle,
.device-sn,
.device-meta {
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.summary-value {
  margin-top: 10px;
  font-size: 24px;
  font-weight: 700;
  color: #1b2437;
}

.section {
  margin-top: 16px;
  padding: 18px;
}

.section-header {
  margin-bottom: 14px;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #1b2437;
}

.action-list,
.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-card {
  padding: 16px;
  background: #f5f7fb;
}

.action-top,
.device-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.action-title,
.device-name {
  font-size: 15px;
  font-weight: 700;
  color: #1b2437;
}

.action-badge,
.device-status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.action-badge {
  background: #dbe7ff;
  color: #1f6fff;
}

.device-card {
  padding: 16px;
  background: #f9fbff;
}

.device-status.online {
  background: #dff6ea;
  color: #18794e;
}

.device-status.pending {
  background: #fff2d6;
  color: #d97706;
}

.device-status.offline {
  background: #fee2e2;
  color: #dc2626;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef4ff;
  font-size: 11px;
  color: #47608b;
}
</style>
