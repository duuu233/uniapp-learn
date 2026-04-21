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
      <view class="page-shell">
        <view class="search-card app-card">
          <input v-model.trim="keyword" class="text-input" placeholder="搜索设备名称 / SN / 位置" />
          <view class="status-list">
            <view
              v-for="item in statusTabs"
              :key="item.value"
              :class="['status-chip', activeStatus === item.value ? 'is-active' : '']"
              @click="activeStatus = item.value"
            >
              {{ item.label }}
            </view>
          </view>
        </view>

        <view class="device-list">
          <view v-for="item in filteredDevices" :key="item.id" class="device-card app-card">
            <view class="device-top">
              <view>
                <view class="device-title">{{ item.name }}</view>
                <view class="device-desc">{{ item.serialNumber }} · {{ item.location }}</view>
              </view>
              <view :class="['app-pill', formatDeviceStatusClass(item.status)]">
                <text>{{ formatDeviceStatus(item.status) }}</text>
              </view>
            </view>
            <view class="device-desc">电量 {{ formatBattery(item.batteryLevel) }} · 信号 {{ formatSignal(item.signalLevel) }}</view>
            <view class="device-actions">
              <view class="mini-button" @click="handleDeviceAction(item.id)">{{ actionText(item.id) }}</view>
              <view class="mini-button" @click="copySerial(item.serialNumber)">复制 SN</view>
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
  formatBattery,
  formatDeviceStatus,
  formatDeviceStatusClass,
  formatSignal,
  getCurrentScenarioUserId,
  getDeviceRole,
} from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()

const keyword = ref('')
const activeStatus = ref<'all' | 'online' | 'offline' | 'pending'>('all')

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '在线', value: 'online' },
  { label: '离线', value: 'offline' },
  { label: '待激活', value: 'pending' },
] as const

const userId = computed(() => getCurrentScenarioUserId(userStore.userInfo.userid))

const filteredDevices = computed(() => {
  return scenarioStore.devices.filter((item) => {
    const matchStatus = activeStatus.value === 'all' ? true : item.status === activeStatus.value
    const keywordValue = keyword.value.toLowerCase()
    const matchKeyword = keywordValue
      ? [item.name, item.serialNumber, item.location].some((entry) => entry.toLowerCase().includes(keywordValue))
      : true
    return matchStatus && matchKeyword
  })
})

function actionText(deviceId: string) {
  const target = scenarioStore.getDeviceById(deviceId)
  if (!target) return '去绑定'
  const role = getDeviceRole(target, userId.value)
  if (role === 'unbound') return '去绑定'
  return '设为当前设备'
}

function handleDeviceAction(deviceId: string) {
  const target = scenarioStore.getDeviceById(deviceId)
  if (!target) return
  const role = getDeviceRole(target, userId.value)
  if (role === 'unbound') {
    uni.navigateTo({ url: `/pages/device/bindDevice?serialNumber=${encodeURIComponent(target.serialNumber)}` })
    return
  }
  scenarioStore.setCurrentDevice(deviceId)
  uni.showToast({ title: `已切换到 ${target.name}`, icon: 'success' })
}

function copySerial(serialNumber: string) {
  uni.setClipboardData({
    data: serialNumber,
    success: () => uni.showToast({ title: 'SN 已复制', icon: 'success' }),
  })
}

onShow(() => {
  scenarioStore.bootstrap()
})
</script>

<style scoped lang="scss">
.search-card {
  padding: 24rpx;
}

.text-input {
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
  color: var(--ink-900);
  font-size: 15px;
}

.status-list {
  display: flex;
  gap: 12rpx;
  margin-top: 18rpx;
  flex-wrap: wrap;
}

.status-chip {
  padding: 10rpx 18rpx;
  border-radius: var(--r-pill);
  background: var(--surface-soft);
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-500);
}

.status-chip.is-active {
  background: var(--brand-50);
  color: var(--brand-700);
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.device-card {
  padding: 24rpx;
}

.device-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.device-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.device-desc {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.device-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
}

.mini-button {
  padding: 10rpx 16rpx;
  border-radius: var(--r-pill);
  background: var(--brand-50);
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-700);
}
</style>
