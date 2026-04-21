<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的相册',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="我的相册">
    <scroll-view scroll-y class="page-scroll">
      <view class="page-shell">
        <view class="toolbar app-card">
          <view class="toolbar-left">
            <view class="toolbar-title">只显示成功投屏到设备的照片</view>
            <view class="toolbar-desc">当前用户只能删除自己上传的照片，删除时会同步释放设备占用空间。</view>
          </view>
          <view class="toolbar-actions">
            <view class="light-button" @click="toggleSelectionMode">{{ selectionMode ? '取消选择' : '批量选择' }}</view>
            <view class="light-button" @click="goHome">继续选图</view>
          </view>
        </view>

        <view v-if="hasLogin && myPhotos.length" class="operate-bar app-card">
          <text>已选 {{ selectedIds.length }} 张</text>
          <view class="operate-actions">
            <view class="mini-button" @click="castSelectedPhotos">投屏所选</view>
            <view class="mini-button danger" @click="deleteSelectedPhotos">删除所选</view>
          </view>
        </view>

        <view v-if="hasLogin && myPhotos.length" class="photo-grid">
          <view
            v-for="item in myPhotos"
            :key="item.id"
            class="photo-card app-card"
            @click="handlePhotoClick(item.id)"
          >
            <image class="photo-image" :src="item.thumbnailPath" mode="aspectFill" />
            <view class="photo-meta">
              <view class="photo-top">
                <text class="photo-name ellipsis">{{ item.name }}</text>
                <view v-if="selectionMode" :class="['select-dot', selectedIds.includes(item.id) ? 'is-active' : '']" />
              </view>
              <view class="photo-desc">{{ formatDateLabel(item.createdAt) }} · {{ item.sizeKb }} KB</view>
              <view class="photo-desc">已投到 {{ item.deviceIds.length }} 台设备</view>
            </view>
          </view>
        </view>

        <view v-else-if="hasLogin" class="empty-card app-card">
          <view class="empty-title">相册还是空的</view>
          <view class="empty-desc">首页完成投屏后，成功的图片会自动进入我的相册。</view>
          <button class="primary-button" @click="goHome">去首页投屏</button>
        </view>

        <view v-else class="empty-card app-card">
          <view class="empty-title">请先登录</view>
          <view class="empty-desc">只有登录后才能查看自己的已投屏照片和执行删除、再次投屏操作。</view>
          <button class="primary-button" @click="goMyCenter">去登录</button>
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
  SCENARIO_ROUTES,
  formatDateLabel,
  getAccessibleDevices,
  getCurrentScenarioUserId,
  getMyPhotos,
} from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()

const selectionMode = ref(false)
const selectedIds = ref<string[]>([])

const userId = computed(() => getCurrentScenarioUserId(userStore.userInfo.userid))
const hasLogin = computed(() => !!userStore.isLogined)
const myPhotos = computed(() => getMyPhotos(scenarioStore.photos, userId.value))
const accessibleDevices = computed(() => getAccessibleDevices(scenarioStore.devices, userId.value))

function goHome() {
  uni.switchTab({ url: SCENARIO_ROUTES.home })
}

function goMyCenter() {
  uni.switchTab({ url: SCENARIO_ROUTES.people })
}

function toggleSelectionMode() {
  selectionMode.value = !selectionMode.value
  if (!selectionMode.value) {
    selectedIds.value = []
  }
}

function handlePhotoClick(photoId: string) {
  if (!selectionMode.value) {
    const urls = myPhotos.value.map((item) => item.filePath)
    const current = myPhotos.value.find((item) => item.id === photoId)?.filePath || urls[0]
    uni.previewImage({ urls, current })
    return
  }

  if (selectedIds.value.includes(photoId)) {
    selectedIds.value = selectedIds.value.filter((item) => item !== photoId)
    return
  }
  selectedIds.value = [...selectedIds.value, photoId]
}

function pickDeviceAndRun(callback: (deviceId: string) => void) {
  if (!accessibleDevices.value.length) {
    uni.showToast({ title: '请先绑定设备', icon: 'none' })
    return
  }

  uni.showActionSheet({
    itemList: accessibleDevices.value.map((item) => `${item.name} · ${item.location}`),
    success: ({ tapIndex }) => {
      const target = accessibleDevices.value[tapIndex]
      if (!target) return
      callback(target.id)
    },
  })
}

function castSelectedPhotos() {
  if (!selectedIds.value.length) {
    uni.showToast({ title: '请先选择照片', icon: 'none' })
    return
  }

  pickDeviceAndRun((deviceId) => {
    const result = scenarioStore.castSavedPhotosToDevice(deviceId, selectedIds.value)
    if (!result.success && result.storageFull) {
      uni.showModal({
        title: '设备内存不足',
        content: '请先清理设备照片，或联系设备所有者执行一键清空。',
        showCancel: false,
      })
      return
    }
    uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
    if (result.success) {
      selectedIds.value = []
      selectionMode.value = false
    }
  })
}

function deleteSelectedPhotos() {
  if (!selectedIds.value.length) {
    uni.showToast({ title: '请先选择照片', icon: 'none' })
    return
  }

  uni.showModal({
    title: '确认删除',
    content: '删除后会同时释放设备中的对应图片占用空间。',
    success: async ({ confirm }) => {
      if (!confirm) return
      const result = await scenarioStore.deletePhotos(selectedIds.value)
      uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
      if (result.success) {
        selectedIds.value = []
        selectionMode.value = false
      }
    },
  })
}

onShow(() => {
  scenarioStore.bootstrap()
})
</script>

<style scoped lang="scss">
.toolbar,
.operate-bar,
.empty-card {
  padding: 24rpx;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.toolbar-left {
  flex: 1;
  min-width: 0;
}

.toolbar-title,
.empty-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.toolbar-desc,
.photo-desc,
.empty-desc {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.toolbar-actions,
.operate-actions {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.light-button,
.mini-button {
  padding: 12rpx 16rpx;
  border-radius: var(--r-pill);
  background: var(--brand-50);
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-700);
  text-align: center;
}

.mini-button.danger {
  background: var(--status-offline-bg);
  color: var(--status-offline-fg);
}

.operate-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  font-size: 13px;
  color: var(--ink-500);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.photo-card {
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 260rpx;
  display: block;
}

.photo-meta {
  padding: 18rpx;
}

.photo-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.photo-name {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-900);
}

.select-dot {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 2rpx solid var(--ink-300);
}

.select-dot.is-active {
  border-color: var(--brand-500);
  background: var(--brand-500);
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
