<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设备定位',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="设备定位">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="summary-grid">
          <view v-for="item in pageData.summary" :key="item.label" class="summary-card">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
          </view>
        </view>

        <view class="map-card">
          <view class="map-title">轨迹静态占位</view>
          <view class="map-placeholder">
            <view class="map-dot dot-a"></view>
            <view class="map-dot dot-b"></view>
            <view class="map-dot dot-c"></view>
            <view class="map-line"></view>
          </view>
        </view>

        <view class="timeline-list">
          <view v-for="item in pageData.timeline" :key="`${item.time}-${item.title}`" class="timeline-item">
            <view class="timeline-time">{{ item.time }}</view>
            <view class="timeline-content">
              <view class="timeline-title">{{ item.title }}</view>
              <view class="timeline-description">{{ item.description }}</view>
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
import { getLocationPageData, type LocationPageData } from '@/service/scenario'

const pageData = ref<LocationPageData | null>(null)

onLoad(async () => {
  pageData.value = await getLocationPageData()
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
.map-card,
.timeline-item {
  border-radius: 20px;
  background: #fff;
}

.summary-card,
.map-card {
  padding: 16px;
}

.summary-label,
.summary-hint,
.timeline-description {
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.summary-value,
.map-title,
.timeline-title {
  font-size: 15px;
  font-weight: 700;
  color: #1b2437;
}

.summary-value {
  margin-top: 8px;
}

.map-card {
  margin: 16px 0;
}

.map-placeholder {
  position: relative;
  height: 180px;
  margin-top: 14px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 20% 30%, rgba(31, 111, 255, 0.12), transparent 22%),
    radial-gradient(circle at 70% 60%, rgba(24, 121, 78, 0.14), transparent 20%),
    linear-gradient(135deg, #f8fbff, #edf3fb);
}

.map-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 4px solid #fff;
  border-radius: 50%;
  box-shadow: 0 6px 14px rgba(31, 111, 255, 0.2);
}

.dot-a {
  top: 34px;
  left: 48px;
  background: #1f6fff;
}

.dot-b {
  top: 78px;
  left: 146px;
  background: #14b8a6;
}

.dot-c {
  top: 120px;
  left: 260px;
  background: #f59e0b;
}

.map-line {
  position: absolute;
  top: 72px;
  left: 60px;
  width: 208px;
  height: 2px;
  border-top: 2px dashed #1f6fff;
  transform: rotate(18deg);
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.timeline-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
}

.timeline-time {
  width: 54px;
  font-size: 12px;
  font-weight: 700;
  color: #1f6fff;
}

.timeline-content {
  flex: 1;
}
</style>
