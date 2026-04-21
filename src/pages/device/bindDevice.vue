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
      <view class="page-shell">
        <view v-if="!hasLogin" class="warn-card app-card">
          <view class="warn-title">请先登录</view>
          <view class="warn-desc">微信绑定手机号快捷登录后，设备才能绑定到当前操作者名下。</view>
          <button class="primary-button" @click="goMyCenter">去登录</button>
        </view>

        <view class="form-card app-card">
          <view class="section-head">
            <view>
              <view class="section-title">绑定表单</view>
              <view class="section-desc">支持扫码填入 SN，也支持从附近设备候选带入。</view>
            </view>
            <view class="light-button" @click="scanQrCode">扫码填充</view>
          </view>

          <view class="field-label">设备 SN 码</view>
          <input v-model.trim="form.serialNumber" class="text-input" placeholder="请输入设备 SN 码" />

          <view class="field-label top-gap">设备名称</view>
          <input v-model.trim="form.name" class="text-input" placeholder="请输入设备名称" />

          <view class="field-label top-gap">安装位置</view>
          <input v-model.trim="form.location" class="text-input" placeholder="请输入安装位置" />

          <view class="field-label top-gap">备注</view>
          <textarea v-model.trim="form.note" class="text-area" maxlength="80" placeholder="可选：备注设备用途或归属" />

          <button class="primary-button" @click="submitBind">确认绑定</button>
        </view>

        <view class="nearby-card app-card">
          <view class="section-head">
            <view>
              <view class="section-title">附近设备候选</view>
              <view class="section-desc">扫码之外，也可以直接点选候选设备把 SN 和基础信息带入表单。</view>
            </view>
            <view class="light-button" @click="refreshCandidates">刷新</view>
          </view>

          <view class="candidate-list">
            <view v-for="item in candidates" :key="item.id" class="candidate-item" @click="fillFromCandidate(item)">
              <view>
                <view class="candidate-title">{{ item.name }}</view>
                <view class="candidate-desc">{{ item.serialNumber }} · {{ item.location }}</view>
              </view>
              <view class="app-pill is-info">信号 {{ item.signalLevel }}/4</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useScenarioStore, useUserStore } from '@/store'
import {
  buildDiscoveryCandidates,
  scanScenarioBluetoothDevices,
  scanScenarioCode,
} from '@/service/scenario'
import type { BluetoothScanResult } from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()

const form = reactive({
  serialNumber: '',
  name: '',
  location: '',
  note: '',
})

const candidates = ref<BluetoothScanResult[]>([])
const hasLogin = computed(() => !!userStore.isLogined)

function goMyCenter() {
  uni.switchTab({ url: '/pages/user/people' })
}

async function refreshCandidates() {
  const bluetoothDevices = await scanScenarioBluetoothDevices()
  const fallback = buildDiscoveryCandidates(scenarioStore.devices)
  const mergedMap = new Map<string, BluetoothScanResult>()
  ;[...fallback, ...bluetoothDevices].forEach((item) => {
    if (!mergedMap.has(item.serialNumber)) {
      mergedMap.set(item.serialNumber, item)
    }
  })
  candidates.value = [...mergedMap.values()]
}

function fillFromCandidate(item: BluetoothScanResult) {
  form.serialNumber = item.serialNumber
  form.name = item.name
  form.location = item.location
  if (!form.note) {
    form.note = `${item.type} · 来自附近设备搜索`
  }
}

async function scanQrCode() {
  try {
    const result = await scanScenarioCode()
    form.serialNumber = result.trim().toUpperCase()
    if (!form.name) {
      form.name = `设备 ${result.slice(-4)}`
    }
  } catch {
    uni.showToast({ title: '未识别到设备码', icon: 'none' })
  }
}

function submitBind() {
  const result = scenarioStore.bindDevice({ ...form })
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
  if (!result.success) return

  uni.showModal({
    title: '绑定成功',
    content: '设备已加入你的设备列表，是否立即前往设备中心？',
    confirmText: '去设备中心',
    cancelText: '留在当前页',
    success: ({ confirm }) => {
      if (confirm) {
        uni.switchTab({ url: '/pages/device/deviceHub' })
      }
    },
  })
}

onLoad((options) => {
  if (typeof options?.serialNumber === 'string') {
    form.serialNumber = decodeURIComponent(options.serialNumber).toUpperCase()
  }
  if (typeof options?.name === 'string') {
    form.name = decodeURIComponent(options.name)
  }
})

onShow(() => {
  scenarioStore.bootstrap()
  refreshCandidates()
})
</script>

<style scoped lang="scss">
.warn-card,
.form-card,
.nearby-card {
  padding: 24rpx;
}

.warn-title,
.section-title,
.candidate-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.warn-desc,
.section-desc,
.candidate-desc,
.field-label {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 20rpx;
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

.top-gap {
  margin-top: 20rpx;
}

.text-input,
.text-area {
  width: 100%;
  margin-top: 10rpx;
  padding: 20rpx 24rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
  color: var(--ink-900);
  font-size: 15px;
}

.text-input {
  height: 88rpx;
}

.text-area {
  min-height: 180rpx;
}

.primary-button {
  margin-top: 24rpx;
  border: none;
  border-radius: 18px;
  background: var(--brand-grad);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}

.candidate-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.candidate-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 18rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
}
</style>
