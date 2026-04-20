<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '权限说明',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="权限说明">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="intro-card">{{ pageData.intro }}</view>

        <view class="permission-list">
          <view v-for="item in pageData.permissions" :key="`${item.platform}-${item.title}`" class="permission-card">
            <view class="permission-top">
              <view>
                <view class="permission-title">{{ item.title }}</view>
                <view class="permission-platform">{{ item.platform }}</view>
              </view>
              <view :class="['permission-flag', item.required ? 'required' : 'optional']">
                {{ item.required ? '必需' : '可选' }}
              </view>
            </view>
            <view class="permission-description">{{ item.description }}</view>
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
import { getPermissionPageData, type PermissionPageData } from '@/service/scenario'

const pageData = ref<PermissionPageData | null>(null)

onLoad(async () => {
  pageData.value = await getPermissionPageData()
})
</script>

<style scoped lang="scss">
.intro-card,
.permission-card {
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.intro-card {
  padding: 28rpx;
  font-size: 13px;
  line-height: 1.8;
  color: var(--ink-500);
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.permission-card {
  padding: 24rpx;
}

.permission-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.permission-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.permission-platform,
.permission-description {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.permission-flag {
  padding: 6rpx 14rpx;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.permission-flag.required {
  background: var(--status-offline-bg);
  color: var(--status-offline-fg);
}

.permission-flag.optional {
  background: var(--status-info-bg);
  color: var(--status-info-fg);
}
</style>
