<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '个人信息',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="个人信息">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="field-list">
          <view v-for="item in pageData.fields" :key="item.label" class="field-card">
            <view class="field-label">{{ item.label }}</view>
            <view class="field-value">{{ item.value }}</view>
            <view class="field-description">{{ item.description }}</view>
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
import { getProfilePageData, type ProfilePageData } from '@/service/scenario'

const pageData = ref<ProfilePageData | null>(null)

onLoad(async () => {
  pageData.value = await getProfilePageData()
})
</script>

<style scoped lang="scss">
.field-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.field-card {
  padding: 24rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.field-label,
.field-description {
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.field-value {
  margin-top: 10rpx;
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.field-description {
  margin-top: 10rpx;
}
</style>
