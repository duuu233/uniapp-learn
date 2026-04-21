<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设备中心',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout :navbarShow="false">
    <scroll-view scroll-y class="page-scroll aurora-bg">
      <view class="page-shell">
        <view class="hero app-card-elevated">
          <view class="hero-kicker">Device Hub</view>
          <view class="hero-title">我的设备</view>
          <view class="hero-subtitle">管理设备名称、使用权限、轮播模式、连接状态和物理存储。</view>
        </view>

        <view v-if="!hasLogin" class="empty-card app-card">
          <view class="empty-title">请先登录</view>
          <view class="empty-desc">设备管理页依赖微信绑定手机号快捷登录，用于识别当前用户的所有者/使用者权限。</view>
          <button class="primary-button" @click="goMyCenter">去登录</button>
        </view>

        <template v-else>
          <view class="summary-grid">
            <view v-for="item in summaryCards" :key="item.label" class="summary-card app-card">
              <view class="summary-label">{{ item.label }}</view>
              <view class="summary-value">{{ item.value }}</view>
              <view class="summary-hint">{{ item.hint }}</view>
            </view>
          </view>

          <view v-if="currentDevice" class="current-card app-card">
            <view class="section-title">当前设备</view>
            <view class="current-name">{{ currentDevice.name }}</view>
            <view class="summary-hint">
              {{ currentDevice.serialNumber }} · {{ currentDevice.location }} · {{ formatDateLabel(currentDevice.lastSeenAt) }}
            </view>
          </view>

          <view class="device-list">
            <view v-for="item in myDevices" :key="item.id" class="device-card app-card">
              <view class="device-top">
                <view class="device-main">
                  <template v-if="editingId === item.id">
                    <input v-model.trim="editingName" class="inline-input" maxlength="20" placeholder="输入设备名称" />
                    <view class="inline-actions">
                      <view class="mini-button" @click="saveRename(item.id)">保存</view>
                      <view class="mini-button" @click="cancelRename">取消</view>
                    </view>
                  </template>
                  <template v-else>
                    <view class="device-name">{{ item.name }}</view>
                    <view class="device-meta">{{ item.serialNumber }} · {{ item.location }}</view>
                  </template>
                </view>
                <view :class="['app-pill', formatDeviceStatusClass(item.status)]">
                  <view class="app-dot" />
                  <text>{{ formatDeviceStatus(item.status) }}</text>
                </view>
              </view>

              <view class="device-tags">
                <view class="tag-pill">{{ formatRole(getDeviceRole(item, userId)) }}</view>
                <view class="tag-pill">所有者：{{ item.ownerName }}</view>
                <view class="tag-pill">存储 {{ formatStorage(item) }}</view>
              </view>

              <view class="device-stats">
                <text>电量 {{ formatBattery(item.batteryLevel) }}</text>
                <text>信号 {{ formatSignal(item.signalLevel) }}</text>
                <text>连接 {{ item.connectionState === 'connected' ? '已连接' : '未连接' }}</text>
              </view>

              <view class="slideshow-row">
                <text class="summary-hint">轮播模式</text>
                <switch :checked="item.slideshowEnabled" color="#315fcb" @change="toggleSlideshow(item.id, $event)" />
              </view>

              <view class="action-row">
                <view class="mini-button" @click="scenarioStore.setCurrentDevice(item.id)">设为当前设备</view>
                <view class="mini-button" @click="startRename(item.id, item.name)">编辑名称</view>
                <view class="mini-button" @click="toggleConnect(item.id)">{{ item.connectionState === 'connected' ? '断开连接' : '连接设备' }}</view>
              </view>

              <view class="action-row">
                <view class="mini-button" @click="claimOwner(item.id)">设为所有者</view>
                <view class="mini-button danger" @click="clearStorage(item.id)">一键清空</view>
              </view>
            </view>
          </view>
        </template>
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
  formatDateLabel,
  formatDeviceStatus,
  formatDeviceStatusClass,
  formatRole,
  formatSignal,
  formatStorage,
  getAccessibleDevices,
  getCurrentScenarioUserId,
  getDeviceRole,
} from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()

const editingId = ref('')
const editingName = ref('')

const userId = computed(() => getCurrentScenarioUserId(userStore.userInfo.userid))
const hasLogin = computed(() => !!userStore.isLogined)
const myDevices = computed(() => getAccessibleDevices(scenarioStore.devices, userId.value))
const currentDevice = computed(() => myDevices.value.find((item) => item.id === scenarioStore.currentDeviceId) || myDevices.value[0] || null)

const summaryCards = computed(() => [
  {
    label: '设备数量',
    value: `${myDevices.value.length}`,
    hint: '我的可操作设备',
  },
  {
    label: '已连接',
    value: `${myDevices.value.filter((item) => item.connectionState === 'connected').length}`,
    hint: '当前小程序会话',
  },
  {
    label: '所有者设备',
    value: `${myDevices.value.filter((item) => getDeviceRole(item, userId.value) === 'owner').length}`,
    hint: '具备完整管理权限',
  },
])

function goMyCenter() {
  uni.switchTab({ url: '/pages/user/people' })
}

function startRename(deviceId: string, currentName: string) {
  editingId.value = deviceId
  editingName.value = currentName
}

function cancelRename() {
  editingId.value = ''
  editingName.value = ''
}

function saveRename(deviceId: string) {
  const result = scenarioStore.renameDevice(deviceId, editingName.value)
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
  if (result.success) cancelRename()
}

function claimOwner(deviceId: string) {
  const result = scenarioStore.claimDeviceOwner(deviceId)
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
}

function clearStorage(deviceId: string) {
  uni.showModal({
    title: '确认一键清空',
    content: '该操作会清空目标设备的物理存储，但保留我的相册记录。',
    confirmColor: '#c24141',
    success: ({ confirm }) => {
      if (!confirm) return
      const result = scenarioStore.clearDeviceStorage(deviceId)
      uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
    },
  })
}

function toggleSlideshow(deviceId: string, event: Record<string, any>) {
  const result = scenarioStore.toggleSlideshow(deviceId, !!event.detail.value)
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
}

function toggleConnect(deviceId: string) {
  const target = scenarioStore.getDeviceById(deviceId)
  if (!target) return
  const result =
    target.connectionState === 'connected'
      ? scenarioStore.disconnectDevice(deviceId)
      : scenarioStore.connectDevice(deviceId)
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
}

onShow(() => {
  scenarioStore.bootstrap()
})
</script>

<style scoped lang="scss">
.hero,
.current-card,
.empty-card {
  padding: 28rpx 24rpx;
}

.hero {
  background: var(--brand-grad-deep);
  color: var(--ink-on-brand);
}

.hero-kicker {
  display: inline-flex;
  padding: 8rpx 18rpx;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.12);
  font-size: 11px;
  font-weight: 700;
}

.hero-title {
  margin-top: 18rpx;
  font-size: 22px;
  font-weight: 800;
}

.hero-subtitle {
  margin-top: 12rpx;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card {
  padding: 22rpx 18rpx;
}

.summary-label,
.summary-hint,
.device-meta {
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.summary-value,
.section-title,
.device-name,
.empty-title,
.current-name {
  margin-top: 10rpx;
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.device-card {
  padding: 24rpx;
}

.device-top,
.action-row,
.slideshow-row {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.device-main {
  flex: 1;
  min-width: 0;
}

.device-tags,
.device-stats,
.inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;
}

.tag-pill,
.mini-button {
  padding: 10rpx 16rpx;
  border-radius: var(--r-pill);
  background: var(--surface-soft);
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-700);
}

.mini-button {
  background: var(--brand-50);
  color: var(--brand-700);
  text-align: center;
}

.mini-button.danger {
  background: var(--status-offline-bg);
  color: var(--status-offline-fg);
}

.action-row {
  margin-top: 16rpx;
}

.inline-input {
  height: 76rpx;
  padding: 0 20rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
  color: var(--ink-900);
  font-size: 15px;
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
</style>
