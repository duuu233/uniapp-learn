<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设备搜索',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="设备搜索">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="section">
          <view class="section-title">筛选项草稿</view>
          <view class="filter-list">
            <view v-for="item in pageData.filters" :key="item.label" class="filter-card">
              <view class="filter-label">{{ item.label }}</view>
              <view class="filter-value">{{ item.value }}</view>
              <view class="filter-description">{{ item.description }}</view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">搜索结果静态示例</view>
          <view class="device-list">
            <view v-for="item in pageData.results" :key="item.id" class="device-card">
              <view class="device-top">
                <view>
                  <view class="device-name">{{ item.name }}</view>
                  <view class="device-sn">{{ item.serialNumber }}</view>
                </view>
                <view class="device-status">{{ item.status }}</view>
              </view>
              <view class="device-meta">{{ item.location }}</view>
              <view class="device-meta">信号 {{ item.signal }} · 电量 {{ item.battery }}</view>
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
import { getSearchDevicePageData, type SearchDevicePageData } from '@/service/scenario'

const pageData = ref<SearchDevicePageData | null>(null)

onLoad(async () => {
  pageData.value = await getSearchDevicePageData()
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
.filter-value,
.device-name {
  font-size: 15px;
  font-weight: 700;
  color: #1b2437;
}

.filter-list,
.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.filter-card,
.device-card {
  padding: 14px;
  border-radius: 16px;
  background: #f5f7fb;
}

.filter-label,
.filter-description,
.device-sn,
.device-meta {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.device-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.device-status {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef4ff;
  font-size: 11px;
  font-weight: 700;
  color: #1f6fff;
}
</style>
