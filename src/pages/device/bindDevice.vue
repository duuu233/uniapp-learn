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
.page-scroll {
  background: #eef2f7;
}

.page-shell {
  padding: 16px 16px 28px;
}

.section {
  margin-bottom: 16px;
  padding: 18px;
  border-radius: 20px;
  background: #fff;
}

.section-title,
.step-title,
.form-value {
  font-size: 15px;
  font-weight: 700;
  color: #1b2437;
}

.step-list,
.form-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.step-item,
.form-card {
  padding: 14px;
  border-radius: 16px;
  background: #f5f7fb;
}

.step-item {
  display: flex;
  gap: 12px;
}

.step-dot {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: 50%;
}

.step-dot.done {
  background: #18794e;
}

.step-dot.active {
  background: #1f6fff;
}

.step-dot.pending {
  background: #d1d5db;
}

.step-description,
.form-label,
.form-description {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}
</style>
