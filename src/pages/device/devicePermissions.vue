<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '权限说明',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="权限说明">
    <scroll-view scroll-y class="page-scroll">
      <view class="page-shell">
        <view class="intro-card app-card">
          首页会直接调用拍照、相册、定位和蓝牙能力；“我的”页负责微信绑定手机号快捷登录。这里可以提前检查关键权限是否就绪。
        </view>

        <view class="permission-list">
          <view class="permission-card app-card">
            <view class="permission-top">
              <view>
                <view class="permission-title">定位权限</view>
                <view class="permission-desc">用于记录当前设备的最近一次操作地点和轨迹。</view>
              </view>
              <view :class="['app-pill', permissionClass(locationState)]">
                <text>{{ permissionText(locationState) }}</text>
              </view>
            </view>
            <view class="permission-actions">
              <view class="mini-button" @click="requestLocationPermission">请求定位</view>
              <view class="mini-button" @click="openSystemSetting">打开系统设置</view>
            </view>
          </view>

          <view class="permission-card app-card">
            <view class="permission-top">
              <view>
                <view class="permission-title">蓝牙能力</view>
                <view class="permission-desc">用于搜索附近设备和建立投屏连接。</view>
              </view>
              <view :class="['app-pill', permissionClass(bluetoothState)]">
                <text>{{ permissionText(bluetoothState) }}</text>
              </view>
            </view>
            <view class="permission-actions">
              <view class="mini-button" @click="checkBluetooth">检测蓝牙</view>
              <view class="mini-button" @click="openDeviceConnect">去设备连接</view>
            </view>
          </view>

          <view class="permission-card app-card">
            <view class="permission-top">
              <view>
                <view class="permission-title">相机 / 相册</view>
                <view class="permission-desc">首页拍照和从相册选择图片时会触发系统授权。</view>
              </view>
              <view :class="['app-pill', permissionClass(cameraState)]">
                <text>{{ permissionText(cameraState) }}</text>
              </view>
            </view>
            <view class="permission-actions">
              <view class="mini-button" @click="requestCameraPermission">触发拍照授权</view>
              <view class="mini-button" @click="requestAlbumPermission">触发相册授权</view>
            </view>
          </view>

          <view class="permission-card app-card">
            <view class="permission-top">
              <view>
                <view class="permission-title">微信绑定手机号快捷登录</view>
                <view class="permission-desc">用于识别当前操作人，不提供独立注册页和退出登录页。</view>
              </view>
              <view :class="['app-pill', permissionClass(phoneState)]">
                <text>{{ permissionText(phoneState) }}</text>
              </view>
            </view>
            <view class="permission-actions">
              <button class="primary-button" open-type="getPhoneNumber" @getphonenumber="handlePhoneLogin">
                微信绑定手机号快捷登录
              </button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { handleWechatPhoneQuickLogin } from '@/service/scenario/account'
import { pickScenarioImages, readMiniProgramAuthSetting, requestScenarioLocation } from '@/service/scenario'
import type { PermissionState } from '@/service/scenario'

const userStore = useUserStore()

const locationState = ref<PermissionState>('pending')
const cameraState = ref<PermissionState>('pending')
const bluetoothState = ref<PermissionState>('pending')
const phoneState = ref<PermissionState>('pending')

function permissionText(state: PermissionState) {
  if (state === 'granted') return '已就绪'
  if (state === 'denied') return '已拒绝'
  if (state === 'unsupported') return '不可用'
  return '待触发'
}

function permissionClass(state: PermissionState) {
  if (state === 'granted') return 'is-online'
  if (state === 'denied') return 'is-offline'
  if (state === 'unsupported') return 'is-info'
  return 'is-pending'
}

async function refreshStates() {
  const setting = await readMiniProgramAuthSetting()
  locationState.value =
    setting.authSetting['scope.userLocation'] === true
      ? 'granted'
      : setting.authSetting['scope.userLocation'] === false
        ? 'denied'
        : 'pending'
  cameraState.value =
    setting.authSetting['scope.camera'] === true
      ? 'granted'
      : setting.authSetting['scope.camera'] === false
        ? 'denied'
        : 'pending'
  phoneState.value = userStore.isLogined ? 'granted' : 'pending'
}

async function requestLocationPermission() {
  try {
    await requestScenarioLocation()
    locationState.value = 'granted'
    uni.showToast({ title: '定位权限已就绪', icon: 'success' })
  } catch {
    locationState.value = 'denied'
    uni.showToast({ title: '定位权限未授予', icon: 'none' })
  }
}

async function checkBluetooth() {
  await new Promise<void>((resolve) => {
    uni.openBluetoothAdapter({
      success: () => {
        bluetoothState.value = 'granted'
        uni.closeBluetoothAdapter({ complete: () => resolve() })
        uni.showToast({ title: '蓝牙可用', icon: 'success' })
      },
      fail: () => {
        bluetoothState.value = 'pending'
        resolve()
        uni.showToast({ title: '请开启系统蓝牙后再试', icon: 'none' })
      },
    })
  })
}

async function requestCameraPermission() {
  try {
    await pickScenarioImages('camera', 1)
    cameraState.value = 'granted'
    uni.showToast({ title: '相机权限已触发', icon: 'success' })
  } catch {
    uni.showToast({ title: '未完成拍照授权', icon: 'none' })
  }
}

async function requestAlbumPermission() {
  try {
    await pickScenarioImages('album', 1)
    cameraState.value = 'granted'
    uni.showToast({ title: '相册权限已触发', icon: 'success' })
  } catch {
    uni.showToast({ title: '未完成相册授权', icon: 'none' })
  }
}

function handlePhoneLogin(event: Record<string, any>) {
  const result = handleWechatPhoneQuickLogin(event?.detail)
  phoneState.value = result.success ? 'granted' : 'pending'
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
}

function openSystemSetting() {
  uni.openSetting()
}

function openDeviceConnect() {
  uni.navigateTo({ url: '/pages/device/deviceConnect' })
}

onShow(() => {
  refreshStates()
})
</script>

<style scoped lang="scss">
.intro-card {
  padding: 24rpx;
  font-size: 13px;
  line-height: 1.8;
  color: var(--ink-500);
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.permission-card {
  padding: 24rpx;
}

.permission-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.permission-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.permission-desc {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.permission-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 18rpx;
  flex-wrap: wrap;
}

.mini-button {
  padding: 10rpx 16rpx;
  border-radius: var(--r-pill);
  background: var(--brand-50);
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-700);
}

.primary-button {
  width: 100%;
  border: none;
  border-radius: 18px;
  background: var(--brand-grad);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
</style>
