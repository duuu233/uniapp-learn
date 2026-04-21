<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设备连接',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="设备连接">
    <scroll-view scroll-y class="page-scroll">
      <view class="page-shell">
        <view class="summary-grid">
          <view v-for="item in summaryCards" :key="item.label" class="summary-card app-card">
            <view class="summary-label">{{ item.label }}</view>
            <view class="summary-value">{{ item.value }}</view>
            <view class="summary-hint">{{ item.hint }}</view>
          </view>
        </view>

        <view class="section app-card">
          <view class="section-head">
            <view>
              <view class="section-title">蓝牙扫描</view>
              <view class="section-desc">优先读取小程序蓝牙搜索结果，没有硬件回包时使用本地设备候选列表兜底。</view>
            </view>
            <view class="light-button" @click="scanNearbyDevices">重新扫描</view>
          </view>

          <view class="scan-list">
            <view v-for="item in scanResults" :key="item.id" class="scan-card">
              <view class="scan-top">
                <view>
                  <view class="scan-title">{{ item.name }}</view>
                  <view class="scan-desc">{{ item.serialNumber }} · {{ item.location }}</view>
                </view>
                <view class="app-pill is-info">{{ item.type }}</view>
              </view>
              <view class="scan-bottom">
                <text class="scan-desc">信号 {{ item.signalLevel }}/4</text>
                <view class="mini-button" @click="connectOrBind(item.serialNumber)">{{ actionLabel(item.serialNumber) }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useScenarioStore, useUserStore } from '@/store'
import {
  buildDiscoveryCandidates,
  formatDateLabel,
  formatDeviceStatus,
  getAccessibleDevices,
  getCurrentScenarioUserId,
  scanScenarioBluetoothDevices,
} from '@/service/scenario'
import type { BluetoothScanResult } from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()

const scanResults = ref<BluetoothScanResult[]>([])

const userId = computed(() => getCurrentScenarioUserId(userStore.userInfo.userid))
const myDevices = computed(() => getAccessibleDevices(scenarioStore.devices, userId.value))

const summaryCards = computed(() => [
  {
    label: '已绑定设备',
    value: `${myDevices.value.length}`,
    hint: '当前登录用户可操作设备',
  },
  {
    label: '已连接',
    value: `${myDevices.value.filter((item) => item.connectionState === 'connected').length}`,
    hint: '蓝牙状态由本地连接流程维护',
  },
  {
    label: '最近在线',
    value: myDevices.value[0] ? formatDeviceStatus(myDevices.value[0].status) : '--',
    hint: myDevices.value[0] ? formatDateLabel(myDevices.value[0].lastSeenAt) : '暂无设备',
  },
])

function actionLabel(serialNumber: string) {
  const target = scenarioStore.devices.find((item) => item.serialNumber === serialNumber)
  if (!target) return '去绑定'
  if (target.connectionState === 'connected') return '断开'
  return '连接'
}

async function scanNearbyDevices() {
  const bluetoothDevices = await scanScenarioBluetoothDevices()
  const fallback = buildDiscoveryCandidates(scenarioStore.devices)
  const mergedMap = new Map<string, BluetoothScanResult>()
  ;[...fallback, ...bluetoothDevices].forEach((item) => {
    if (!mergedMap.has(item.serialNumber)) {
      mergedMap.set(item.serialNumber, item)
    }
  })
  scanResults.value = [...mergedMap.values()]
}

function connectOrBind(serialNumber: string) {
  const target = scenarioStore.devices.find((item) => item.serialNumber === serialNumber)
  if (!target) {
    uni.navigateTo({ url: `/pages/device/bindDevice?serialNumber=${encodeURIComponent(serialNumber)}` })
    return
  }

  if (target.connectionState === 'connected') {
    const result = scenarioStore.disconnectDevice(target.id)
    uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
    return
  }

  const result = scenarioStore.connectDevice(target.id)
  if (!result.success && result.message.includes('绑定')) {
    uni.navigateTo({ url: `/pages/device/bindDevice?serialNumber=${encodeURIComponent(serialNumber)}` })
    return
  }
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
}

onShow(() => {
  scenarioStore.bootstrap()
  scanNearbyDevices()
})
</script>

<style scoped lang="scss">
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card,
.section {
  padding: 24rpx;
}

.summary-label,
.summary-hint,
.section-desc,
.scan-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.summary-value,
.section-title,
.scan-title {
  margin-top: 10rpx;
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.section-head,
.scan-top,
.scan-bottom {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.light-button,
.mini-button {
  padding: 10rpx 18rpx;
  border-radius: var(--r-pill);
  background: var(--brand-50);
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-700);
  white-space: nowrap;
}

.scan-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 20rpx;
}

.scan-card {
  padding: 22rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
}
</style>
