<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
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
          <view class="hero-kicker">微信小程序投屏</view>
          <view class="hero-title">拍照、选图、选设备、确认投屏</view>
          <view class="hero-subtitle">
            当前版本围绕微信小程序落地，首页直接承接拍照、相册、权限检查、设备切换和投屏确认。
          </view>
          <view class="hero-stats">
            <view class="hero-stat">
              <text class="hero-stat-value">{{ summaryCards[0].value }}</text>
              <text class="hero-stat-label">{{ summaryCards[0].label }}</text>
            </view>
            <view class="hero-stat">
              <text class="hero-stat-value">{{ summaryCards[1].value }}</text>
              <text class="hero-stat-label">{{ summaryCards[1].label }}</text>
            </view>
            <view class="hero-stat">
              <text class="hero-stat-value">{{ summaryCards[2].value }}</text>
              <text class="hero-stat-label">{{ summaryCards[2].label }}</text>
            </view>
          </view>
        </view>

        <view v-if="!hasLogin" class="login-tip app-card">
          <view>
            <view class="section-title">还未登录</view>
            <view class="section-desc">投屏、相册删除和设备管理都依赖微信绑定手机号快捷登录。</view>
          </view>
          <view class="link-button" @click="openRoute(SCENARIO_ROUTES.people, true)">去完成登录</view>
        </view>

        <view class="section app-card">
          <view class="section-head">
            <view>
              <view class="app-section-kicker">Current Device</view>
              <view class="section-title">当前投屏设备</view>
            </view>
            <view class="link-button" @click="pickDevice">切换设备</view>
          </view>
          <view v-if="activeDevice" class="device-card">
            <view class="device-top">
              <view>
                <view class="device-name">{{ activeDevice.name }}</view>
                <view class="device-meta">{{ activeDevice.serialNumber }} · {{ activeDevice.location }}</view>
              </view>
              <view :class="['app-pill', formatDeviceStatusClass(activeDevice.status)]">
                <view class="app-dot" />
                <text>{{ formatDeviceStatus(activeDevice.status) }}</text>
              </view>
            </view>
            <view class="device-stats">
              <text>电量 {{ formatBattery(activeDevice.batteryLevel) }}</text>
              <text>信号 {{ formatSignal(activeDevice.signalLevel) }}</text>
              <text>存储 {{ formatStorage(activeDevice) }}</text>
            </view>
          </view>
          <view v-else class="empty-card">
            <view class="empty-title">还没有可用设备</view>
            <view class="empty-desc">先去绑定设备，或在“我的设备”里把设备设为当前投屏设备。</view>
          </view>
        </view>

        <view class="action-grid">
          <view class="action-card app-card-soft" hover-class="action-card--hover" @click="pickFromCamera">
            <view class="action-icon">拍</view>
            <view class="action-title">拍照</view>
            <view class="action-desc">直接调用相机拍摄</view>
          </view>
          <view class="action-card app-card-soft" hover-class="action-card--hover" @click="pickFromAlbum">
            <view class="action-icon">册</view>
            <view class="action-title">相册</view>
            <view class="action-desc">批量选择图片</view>
          </view>
          <view class="action-card app-card-soft" hover-class="action-card--hover" @click="openRoute(SCENARIO_ROUTES.devicePermissions)">
            <view class="action-icon">权</view>
            <view class="action-title">用户权限</view>
            <view class="action-desc">定位、蓝牙、相机</view>
          </view>
          <view class="action-card app-card-soft" hover-class="action-card--hover" @click="openRoute(SCENARIO_ROUTES.bindDevice)">
            <view class="action-icon">绑</view>
            <view class="action-title">绑定设备</view>
            <view class="action-desc">扫码或输入 SN</view>
          </view>
        </view>

        <view class="section app-card">
          <view class="section-head">
            <view>
              <view class="app-section-kicker">Permission</view>
              <view class="section-title">关键权限状态</view>
            </view>
            <view class="link-button" @click="refreshPermissionState">刷新</view>
          </view>
          <view class="permission-list">
            <view v-for="item in permissionCards" :key="item.label" class="permission-item">
              <text class="permission-label">{{ item.label }}</text>
              <text :class="['permission-value', item.className]">{{ item.value }}</text>
            </view>
          </view>
        </view>

        <view class="section app-card">
          <view class="section-head">
            <view>
              <view class="app-section-kicker">Cast Flow</view>
              <view class="section-title">待投屏图片</view>
              <view class="section-desc">流程为：选择图片 → 选择设备 → 预览尺寸 → 确认投屏。</view>
            </view>
            <view v-if="draftFiles.length" class="link-button danger" @click="clearDrafts">清空</view>
          </view>
          <view v-if="draftFiles.length" class="preview-grid">
            <view v-for="item in draftFiles" :key="item.id" class="preview-card">
              <image class="preview-image" :src="item.tempFilePath" mode="aspectFill" @click="previewDraft(item.id)" />
              <view class="preview-meta">
                <text class="ellipsis">{{ item.name }}</text>
                <text>{{ item.width }} × {{ item.height }}</text>
              </view>
            </view>
          </view>
          <view v-else class="empty-card">
            <view class="empty-title">还没有选择照片</view>
            <view class="empty-desc">支持拍照或从相册批量选择，选中的图片会先在本页预览后再确认投屏。</view>
          </view>
          <view class="cast-footer">
            <text class="cast-tip">
              预处理后将以压缩图投屏，若设备空间不足会直接提示并保留失败记录。
            </text>
            <button class="primary-button" @click="castSelected">确认投屏</button>
          </view>
        </view>

        <view class="section app-card">
          <view class="section-head">
            <view>
              <view class="app-section-kicker">Recent</view>
              <view class="section-title">最近投屏记录</view>
            </view>
            <view class="link-button" @click="openRoute(SCENARIO_ROUTES.castCenter)">查看全部</view>
          </view>
          <view v-if="recentRecords.length" class="record-list">
            <view v-for="item in recentRecords" :key="item.id" class="record-item">
              <image class="record-cover" :src="item.photoPath || '/static/placeholder.png'" mode="aspectFill" />
              <view class="record-body">
                <view class="record-top">
                  <view class="record-title">{{ item.photoName }}</view>
                  <view :class="['app-pill', item.status === 'success' ? 'is-online' : 'is-offline']">
                    <text>{{ item.status === 'success' ? '成功' : '失败' }}</text>
                  </view>
                </view>
                <view class="record-desc">{{ item.deviceName }} · {{ formatDateLabel(item.createdAt) }}</view>
                <view class="record-desc">{{ item.message }}</view>
              </view>
            </view>
          </view>
          <view v-else class="empty-card">
            <view class="empty-title">暂无投屏记录</view>
            <view class="empty-desc">完成第一次投屏后，成功和失败记录都会展示在这里。</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useScenarioStore, useUserStore } from '@/store'
import {
  SCENARIO_ROUTES,
  formatBattery,
  formatDateLabel,
  formatDeviceStatus,
  formatDeviceStatusClass,
  formatSignal,
  formatStorage,
  getAccessibleDevices,
  getCurrentScenarioUserId,
  getMyCastRecords,
  getMyPhotos,
  pickScenarioImages,
  readMiniProgramAuthSetting,
} from '@/service/scenario'
import type { DraftPhotoInput, PermissionState } from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()

const draftFiles = ref<DraftPhotoInput[]>([])
const permissionState = reactive<Record<string, PermissionState>>({
  location: 'pending',
  camera: 'pending',
  phone: 'pending',
  bluetooth: 'pending',
})

const userId = computed(() => getCurrentScenarioUserId(userStore.userInfo.userid))
const hasLogin = computed(() => !!userStore.isLogined)
const accessibleDevices = computed(() => getAccessibleDevices(scenarioStore.devices, userId.value))
const activeDevice = computed(() => {
  const current = accessibleDevices.value.find((item) => item.id === scenarioStore.currentDeviceId)
  return current || accessibleDevices.value[0] || null
})
const myPhotos = computed(() => getMyPhotos(scenarioStore.photos, userId.value))
const myRecords = computed(() => getMyCastRecords(scenarioStore.castRecords, userId.value))
const recentRecords = computed(() => myRecords.value.slice(0, 3))

const summaryCards = computed(() => [
  { label: '我的设备', value: `${accessibleDevices.value.length}` },
  { label: '我的相册', value: `${myPhotos.value.length}` },
  { label: '投屏记录', value: `${myRecords.value.length}` },
])

const permissionCards = computed(() => [
  buildPermissionCard('定位权限', permissionState.location),
  buildPermissionCard('相机权限', permissionState.camera),
  buildPermissionCard('蓝牙状态', permissionState.bluetooth),
  buildPermissionCard('手机号登录', permissionState.phone),
])

function buildPermissionCard(label: string, state: PermissionState) {
  if (state === 'granted') {
    return { label, value: '已就绪', className: 'is-ready' }
  }
  if (state === 'denied') {
    return { label, value: '已拒绝', className: 'is-danger' }
  }
  if (state === 'unsupported') {
    return { label, value: '不可用', className: 'is-muted' }
  }
  return { label, value: '待触发', className: 'is-pending' }
}

function openRoute(url: string, isTab = false) {
  if (isTab) {
    uni.switchTab({ url })
    return
  }
  uni.navigateTo({ url })
}

async function refreshPermissionState() {
  const setting = await readMiniProgramAuthSetting()
  permissionState.location = setting.authSetting['scope.userLocation'] === true ? 'granted' : setting.authSetting['scope.userLocation'] === false ? 'denied' : 'pending'
  permissionState.camera = setting.authSetting['scope.camera'] === true ? 'granted' : setting.authSetting['scope.camera'] === false ? 'denied' : 'pending'
  permissionState.phone = hasLogin.value ? 'granted' : 'pending'

  await new Promise<void>((resolve) => {
    uni.openBluetoothAdapter({
      success: () => {
        permissionState.bluetooth = 'granted'
        uni.closeBluetoothAdapter({ complete: () => resolve() })
      },
      fail: () => {
        permissionState.bluetooth = 'pending'
        resolve()
      },
    })
  })
}

async function appendDrafts(source: 'camera' | 'album') {
  try {
    const count = source === 'album' ? 9 : 1
    const files = await pickScenarioImages(source, count)
    draftFiles.value = [...draftFiles.value, ...files].slice(0, 9)
    if (source === 'camera') permissionState.camera = 'granted'
  } catch {
    uni.showToast({ title: '未选择图片', icon: 'none' })
  }
}

function pickFromCamera() {
  appendDrafts('camera')
}

function pickFromAlbum() {
  appendDrafts('album')
}

function clearDrafts() {
  draftFiles.value = []
}

function previewDraft(photoId: string) {
  const urls = draftFiles.value.map((item) => item.tempFilePath)
  const current = draftFiles.value.find((item) => item.id === photoId)?.tempFilePath || urls[0]
  uni.previewImage({ urls, current })
}

function pickDevice() {
  if (!accessibleDevices.value.length) {
    uni.showToast({ title: '请先绑定设备', icon: 'none' })
    return
  }

  uni.showActionSheet({
    itemList: accessibleDevices.value.map((item) => `${item.name} · ${item.location}`),
    success: ({ tapIndex }) => {
      const target = accessibleDevices.value[tapIndex]
      if (!target) return
      scenarioStore.setCurrentDevice(target.id)
      uni.showToast({ title: `已切换到 ${target.name}`, icon: 'none' })
    },
  })
}

async function castSelected() {
  if (!hasLogin.value) {
    uni.showModal({
      title: '需要登录',
      content: '投屏前请先完成微信绑定手机号快捷登录。',
      confirmText: '去登录',
      success: ({ confirm }) => {
        if (confirm) openRoute(SCENARIO_ROUTES.people, true)
      },
    })
    return
  }

  if (!activeDevice.value) {
    uni.showToast({ title: '请先选择设备', icon: 'none' })
    return
  }

  const result = await scenarioStore.castDraftPhotosToDevice(activeDevice.value.id, draftFiles.value)
  if (!result.success && result.storageFull) {
    uni.showModal({
      title: '设备内存已满',
      content: '可以先去“我的相册”删除已上传照片，或联系设备所有者清理设备存储。',
      confirmText: '我的相册',
      cancelText: '知道了',
      success: ({ confirm }) => {
        if (confirm) {
          openRoute(SCENARIO_ROUTES.albumCenter)
        }
      },
    })
    return
  }

  if (!result.success) {
    uni.showToast({ title: result.message, icon: 'none' })
    return
  }

  draftFiles.value = []
  uni.showToast({ title: result.message, icon: 'success' })
}

onShow(() => {
  scenarioStore.bootstrap()
  refreshPermissionState()
})
</script>

<style scoped lang="scss">
.hero {
  padding: 36rpx 32rpx;
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
  margin-top: 20rpx;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.35;
}

.hero-subtitle {
  margin-top: 12rpx;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 28rpx;
}

.hero-stat {
  padding: 18rpx;
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.08);
}

.hero-stat-value {
  display: block;
  font-size: 22px;
  font-weight: 800;
}

.hero-stat-label {
  display: block;
  margin-top: 8rpx;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
}

.login-tip,
.section {
  padding: 28rpx 24rpx;
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--ink-900);
}

.section-desc {
  margin-top: 8rpx;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-400);
}

.link-button {
  padding: 10rpx 18rpx;
  border-radius: var(--r-pill);
  background: var(--brand-50);
  color: var(--brand-700);
  font-size: 12px;
  font-weight: 700;
}

.link-button.danger {
  background: var(--status-offline-bg);
  color: var(--status-offline-fg);
}

.device-card {
  padding: 22rpx;
  border-radius: var(--r-md);
  background: linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%);
  border: 1rpx solid rgba(49, 95, 203, 0.08);
}

.device-top,
.record-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.device-name,
.record-title,
.action-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-900);
}

.device-meta,
.record-desc {
  margin-top: 8rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.device-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 18rpx;
  font-size: 12px;
  color: var(--ink-500);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.action-card {
  padding: 24rpx;
}

.action-card--hover {
  transform: translateY(-2rpx);
}

.action-icon {
  width: 64rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 20rpx;
  background: var(--brand-50);
  color: var(--brand-700);
  text-align: center;
  font-size: 15px;
  font-weight: 800;
}

.action-desc,
.cast-tip,
.empty-desc,
.preview-meta,
.permission-label {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.permission-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.permission-item {
  padding: 20rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
}

.permission-value {
  display: block;
  margin-top: 8rpx;
  font-size: 14px;
  font-weight: 700;
}

.permission-value.is-ready {
  color: var(--status-online-fg);
}

.permission-value.is-danger {
  color: var(--status-offline-fg);
}

.permission-value.is-pending {
  color: var(--status-pending-fg);
}

.permission-value.is-muted {
  color: var(--ink-300);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.preview-card {
  overflow: hidden;
  border-radius: var(--r-md);
  background: var(--surface-soft);
}

.preview-image {
  width: 100%;
  height: 220rpx;
  display: block;
}

.preview-meta {
  padding: 16rpx;
  margin-top: 0;
}

.cast-footer {
  margin-top: 20rpx;
}

.primary-button {
  margin-top: 16rpx;
  border: none;
  border-radius: 18px;
  background: var(--brand-grad);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-item {
  display: flex;
  gap: 16rpx;
  padding: 18rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
}

.record-cover {
  width: 120rpx;
  height: 120rpx;
  flex-shrink: 0;
  border-radius: 20rpx;
}

.record-body {
  flex: 1;
  min-width: 0;
}

.empty-card {
  padding: 28rpx 20rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
}

.empty-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-900);
}
</style>
