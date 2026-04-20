<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '绑定设备',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="绑定设备">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="section">
          <view class="section-title">绑定流程</view>
          <view class="step-list">
            <view v-for="item in pageData.steps" :key="item.title" class="step-item">
              <view :class="['step-dot', item.status]"></view>
              <view class="step-body">
                <view class="step-title">{{ item.title }}</view>
                <view class="step-description">{{ item.description }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">表单草稿</view>
          <view class="form-list">
            <view v-for="item in pageData.formDraft" :key="item.label" class="form-card">
              <view class="form-label">{{ item.label }}</view>
              <view class="form-value">{{ item.value }}</view>
              <view class="form-description">{{ item.description }}</view>
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
import { getBindDevicePageData, type BindDevicePageData } from '@/service/scenario'

const pageData = ref<BindDevicePageData | null>(null)

onLoad(async () => {
  pageData.value = await getBindDevicePageData()
})
</script>

<style scoped lang="scss">
.section {
  padding: 28rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.section-title,
.step-title,
.form-value {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.step-list,
.form-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 20rpx;
}

.step-item,
.form-card {
  padding: 24rpx;
  border: 1rpx solid rgba(49, 95, 203, 0.08);
  border-radius: var(--r-md);
  background: linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%);
}

.step-item {
  display: flex;
  gap: 16rpx;
}

.step-dot {
  width: 12rpx;
  height: 12rpx;
  margin-top: 10rpx;
  border-radius: 50%;
}

.step-dot.done {
  background: var(--status-online-fg);
}

.step-dot.active {
  background: var(--brand-500);
}

.step-dot.pending {
  background: var(--ink-300);
}

.step-description,
.form-label,
.form-description {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}
</style>
