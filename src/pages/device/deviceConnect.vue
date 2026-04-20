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
.section {
  border-radius: 20px;
  background: #fff;
}

.summary-card {
  padding: 16px 14px;
}

.summary-label,
.summary-hint,
.step-description {
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.summary-value,
.section-title,
.step-title {
  font-size: 15px;
  font-weight: 700;
  color: #1b2437;
}

.summary-value {
  margin-top: 8px;
}

.section {
  margin: 16px 0;
  padding: 18px;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.step-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: #f5f7fb;
}

.step-flag {
  width: 12px;
  border-radius: 999px;
}

.step-flag.done {
  background: #18794e;
}

.step-flag.active {
  background: #1f6fff;
}

.step-flag.pending {
  background: #d1d5db;
}

.step-body {
  flex: 1;
}
</style>
