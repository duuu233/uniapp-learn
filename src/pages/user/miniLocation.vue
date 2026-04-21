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
      <view class="page-shell">
        <view class="summary-card app-card">
          <view class="section-head">
            <view>
              <view class="section-title">{{ activeDevice ? activeDevice.name : '未选择设备' }}</view>
              <view class="section-desc">
                {{ activeDevice ? `${activeDevice.location} · 最近更新 ${formatDateLabel(activeDevice.lastSeenAt)}` : '登录并选择设备后，可记录当前位置并查看轨迹。' }}
              </view>
            </view>
            <view class="light-button" @click="refreshLocation">更新当前位置</view>
          </view>
          <view v-if="activeDevice" class="summary-row">
            <text>轨迹点 {{ trackList.length }}</text>
            <text>当前设备 {{ activeDevice.serialNumber }}</text>
          </view>
        </view>

        <view v-if="activeDevice" class="map-card app-card">
          <map
            class="map-view"
            :latitude="mapCenter.latitude"
            :longitude="mapCenter.longitude"
            :markers="markers"
            :polyline="polyline"
            :scale="16"
            show-location
          />
        </view>

        <view v-if="activeDevice && trackList.length" class="timeline-list">
          <view v-for="item in trackList" :key="item.id" class="timeline-card app-card">
            <view class="timeline-title">{{ item.name }}</view>
            <view class="timeline-desc">{{ item.latitude.toFixed(4) }}, {{ item.longitude.toFixed(4) }}</view>
            <view class="timeline-desc">{{ formatDateLabel(item.createdAt) }}</view>
          </view>
        </view>

        <view v-else class="empty-card app-card">
          <view class="empty-title">暂无定位轨迹</view>
          <view class="empty-desc">点击“更新当前位置”后，当前设备会记录一次新的定位点。</view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useScenarioStore, useUserStore } from '@/store'
import {
  formatDateLabel,
  getAccessibleDevices,
  getCurrentScenarioUserId,
  requestScenarioLocation,
} from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()

const userId = computed(() => getCurrentScenarioUserId(userStore.userInfo.userid))
const accessibleDevices = computed(() => getAccessibleDevices(scenarioStore.devices, userId.value))
const activeDevice = computed(() => {
  const current = accessibleDevices.value.find((item) => item.id === scenarioStore.currentDeviceId)
  return current || accessibleDevices.value[0] || null
})
const trackList = computed(() => (activeDevice.value ? scenarioStore.getTrackListByDevice(activeDevice.value.id) : []))

const mapCenter = computed(() => {
  const latest = trackList.value[0]
  if (latest) {
    return { latitude: latest.latitude, longitude: latest.longitude }
  }
  return { latitude: 30.2741, longitude: 120.1551 }
})

const markers = computed(() =>
  trackList.value.map((item, index) => ({
    id: index,
    latitude: item.latitude,
    longitude: item.longitude,
    title: item.name,
    width: 24,
    height: 24,
    iconPath: '/static/location.png',
  })),
)

const polyline = computed(() => [
  {
    points: [...trackList.value]
      .reverse()
      .map((item) => ({ latitude: item.latitude, longitude: item.longitude })),
    color: '#315fcb',
    width: 4,
    dottedLine: false,
  },
])

async function refreshLocation() {
  if (!activeDevice.value) {
    uni.showToast({ title: '请先登录并选择设备', icon: 'none' })
    return
  }

  try {
    const location = await requestScenarioLocation()
    scenarioStore.addLocationTrack(
      activeDevice.value.id,
      location.latitude,
      location.longitude,
      location.address || activeDevice.value.location,
    )
    uni.showToast({ title: '定位已更新', icon: 'success' })
  } catch {
    uni.showModal({
      title: '定位失败',
      content: '请检查小程序定位权限后重试。',
      showCancel: false,
    })
  }
}

onShow(() => {
  scenarioStore.bootstrap()
})
</script>

<style scoped lang="scss">
.summary-card,
.map-card,
.empty-card {
  padding: 24rpx;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.section-title,
.timeline-title,
.empty-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.section-desc,
.timeline-desc,
.empty-desc {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.summary-row {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
  font-size: 12px;
  color: var(--ink-500);
}

.light-button {
  padding: 10rpx 18rpx;
  border-radius: var(--r-pill);
  background: var(--brand-50);
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-700);
  white-space: nowrap;
}

.map-view {
  width: 100%;
  height: 520rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.timeline-card {
  padding: 22rpx 24rpx;
}
</style>
