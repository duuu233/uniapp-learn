<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '投诉管理',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="投诉管理">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="summary-grid">
          <view v-for="item in pageData.channels" :key="item.label" class="summary-card">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
          </view>
        </view>

        <view class="ticket-list">
          <view v-for="item in pageData.tickets" :key="item.id" class="ticket-card">
            <view class="ticket-top">
              <view class="ticket-title">{{ item.title }}</view>
              <view class="ticket-status">{{ item.status }}</view>
            </view>
            <view class="ticket-meta">{{ item.id }} · {{ item.owner }}</view>
            <view class="ticket-meta">最近更新：{{ item.updatedAt }}</view>
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
import { getComplaintPageData, type ComplaintPageData } from '@/service/scenario'

const pageData = ref<ComplaintPageData | null>(null)

onLoad(async () => {
  pageData.value = await getComplaintPageData()
})
</script>

<style scoped lang="scss">
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card,
.ticket-card {
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.summary-card,
.ticket-card {
  padding: 24rpx;
}

.summary-label,
.summary-hint,
.ticket-meta {
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.summary-value,
.ticket-title {
  margin-top: 10rpx;
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.ticket-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.ticket-status {
  padding: 6rpx 14rpx;
  border-radius: 999px;
  background: var(--status-pending-bg);
  font-size: 11px;
  font-weight: 700;
  color: var(--status-pending-fg);
}
</style>
