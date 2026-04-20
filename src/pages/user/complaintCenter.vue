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
.page-scroll {
  background: #eef2f7;
}

.page-shell {
  padding: 16px 16px 28px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-card,
.ticket-card {
  border-radius: 20px;
  background: #fff;
}

.summary-card,
.ticket-card {
  padding: 16px;
}

.summary-label,
.summary-hint,
.ticket-meta {
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.summary-value,
.ticket-title {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #1b2437;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.ticket-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.ticket-status {
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff2d6;
  font-size: 11px;
  font-weight: 700;
  color: #d97706;
}
</style>
