<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设置',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="设置">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="setting-list">
          <view v-for="item in pageData.settings" :key="item.title" class="setting-card">
            <view class="setting-top">
              <view class="setting-title">{{ item.title }}</view>
              <view class="setting-value">{{ item.value }}</view>
            </view>
            <view class="setting-description">{{ item.description }}</view>
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
import { getSettingsPageData, type SettingsPageData } from '@/service/scenario'

const pageData = ref<SettingsPageData | null>(null)

onLoad(async () => {
  pageData.value = await getSettingsPageData()
})
</script>

<style scoped lang="scss">
.setting-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.setting-card {
  padding: 24rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.setting-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.setting-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.setting-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-600);
}

.setting-description {
  margin-top: 12rpx;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-400);
}
</style>
