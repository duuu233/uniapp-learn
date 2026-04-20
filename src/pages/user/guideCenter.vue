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
.page-scroll {
  background: #eef2f7;
}

.page-shell {
  padding: 16px 16px 28px;
}

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.doc-card {
  padding: 16px;
  border-radius: 20px;
  background: #fff;
}

.doc-category {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef4ff;
  font-size: 11px;
  color: #1f6fff;
}

.doc-title {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #1b2437;
}

.doc-summary {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.7;
  color: #7a8499;
}
</style>
