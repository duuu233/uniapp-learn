<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '资料指南',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="资料指南">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="doc-list">
          <view v-for="item in pageData.docs" :key="item.title" class="doc-card">
            <view class="doc-category">{{ item.category }}</view>
            <view class="doc-title">{{ item.title }}</view>
            <view class="doc-summary">{{ item.summary }}</view>
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
import { getGuidePageData, type GuidePageData } from '@/service/scenario'

const pageData = ref<GuidePageData | null>(null)

onLoad(async () => {
  pageData.value = await getGuidePageData()
})
</script>

<style scoped lang="scss">
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.doc-card {
  padding: 24rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.doc-category {
  display: inline-flex;
  padding: 6rpx 14rpx;
  border-radius: 999px;
  background: var(--status-info-bg);
  font-size: 11px;
  color: var(--status-info-fg);
  font-weight: 700;
}

.doc-title {
  margin-top: 16rpx;
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.doc-summary {
  margin-top: 12rpx;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-400);
}
</style>
