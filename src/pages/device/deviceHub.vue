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
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="hero">
          <view class="hero-title">设备中心</view>
          <view class="hero-subtitle">设备管理、绑定、搜索、连接和状态时间线统一收口在这里。</view>
        </view>

        <view class="summary-grid">
          <view v-for="item in pageData.summary" :key="item.label" class="summary-card">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">快捷入口</view>
          <view class="shortcut-list">
            <view v-for="item in pageData.shortcuts" :key="item.title" class="shortcut-card" @click="openRoute(item.url)">
              <view>
                <view class="shortcut-title">{{ item.title }}</view>
                <view class="shortcut-subtitle">{{ item.subtitle }}</view>
              </view>
              <view class="shortcut-badge">{{ item.badge }}</view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">设备列表</view>
          <view class="device-list">
            <view v-for="item in pageData.devices" :key="item.id" class="device-card">
              <view class="device-top">
                <view>
                  <view class="device-name">{{ item.name }}</view>
                  <view class="device-sn">{{ item.serialNumber }}</view>
                </view>
                <view :class="['device-status', statusClass(item.status)]">{{ item.status }}</view>
              </view>
              <view class="device-meta">{{ item.location }}</view>
              <view class="device-meta">信号 {{ item.signal }} · 电量 {{ item.battery }} · 最近 {{ item.lastSeen }}</view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">最新动态</view>
          <view class="timeline-list">
            <view v-for="item in pageData.timeline" :key="`${item.time}-${item.title}`" class="timeline-item">
              <view class="timeline-time">{{ item.time }}</view>
              <view class="timeline-content">
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
  if (status === '在线') return 'online'
  if (status === '待激活') return 'pending'
  return 'offline'
}

onLoad(async () => {
  pageData.value = await getDeviceHubPageData()
})
</script>

<style scoped lang="scss">
.page-scroll {
  background: #eef2f7;
}

.page-shell {
  padding: 18px 16px 28px;
}

.hero,
.summary-card,
.section {
  border-radius: 22px;
  background: #fff;
}

.hero {
  padding: 20px;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  color: #fff;
}

.hero-title,
.section-title {
  font-size: 17px;
  font-weight: 700;
}

.hero-subtitle,
.summary-label,
.summary-hint,
.shortcut-subtitle,
.device-sn,
.device-meta,
.timeline-description {
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.hero-subtitle {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.84);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.summary-card {
  padding: 16px;
}

.summary-value {
  margin-top: 8px;
  font-size: 23px;
  font-weight: 700;
  color: #1b2437;
}

.section {
  margin-top: 16px;
  padding: 18px;
}

.shortcut-list,
.device-list,
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.shortcut-card,
.device-card,
.timeline-item {
  padding: 14px 16px;
  border-radius: 18px;
  background: #f5f7fb;
}

.shortcut-card,
.device-top,
.timeline-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.shortcut-title,
.device-name,
.timeline-title {
  font-size: 15px;
  font-weight: 600;
  color: #1b2437;
}

.shortcut-badge,
.device-status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.shortcut-badge {
  background: #d8f4ef;
  color: #0f766e;
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

.timeline-time {
  width: 54px;
  font-size: 12px;
  font-weight: 700;
  color: #0f766e;
}

.timeline-content {
  flex: 1;
}
</style>
