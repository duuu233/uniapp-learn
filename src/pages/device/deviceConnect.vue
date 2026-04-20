<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设备连接',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="设备连接">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="summary-grid">
          <view v-for="item in pageData.summary" :key="item.label" class="summary-card">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">连接步骤</view>
          <view class="step-list">
            <view v-for="item in pageData.steps" :key="item.title" class="step-item">
              <view :class="['step-flag', item.status]"></view>
              <view class="step-body">
                <view class="step-title">{{ item.title }}</view>
                <view class="step-description">{{ item.description }}</view>
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
import { getConnectionPageData, type ConnectionPageData } from '@/service/scenario'

const pageData = ref<ConnectionPageData | null>(null)

onLoad(async () => {
  pageData.value = await getConnectionPageData()
})
</script>

<style scoped lang="scss">
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card,
.section {
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.summary-card {
  padding: 24rpx 22rpx;
  border-radius: var(--r-md);
}

.summary-label,
.summary-hint,
.step-description {
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.summary-value,
.section-title,
.step-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.summary-value {
  margin-top: 10rpx;
}

.section {
  padding: 28rpx;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 20rpx;
}

.step-item {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(49, 95, 203, 0.08);
  border-radius: var(--r-md);
  background: linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%);
}

.step-flag {
  width: 12rpx;
  border-radius: 999px;
}

.step-flag.done {
  background: var(--status-online-fg);
}

.step-flag.active {
  background: var(--brand-500);
}

.step-flag.pending {
  background: var(--ink-300);
}

.step-body {
  flex: 1;
}
</style>
