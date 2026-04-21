<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '投屏管理',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="投屏管理">
    <scroll-view scroll-y class="page-scroll">
      <view class="page-shell">
        <view class="filter-bar app-card">
          <view
            v-for="item in filters"
            :key="item.value"
            :class="['filter-chip', activeFilter === item.value ? 'is-active' : '']"
            @click="activeFilter = item.value"
          >
            {{ item.label }}
          </view>
        </view>

        <view v-if="hasLogin && filteredRecords.length" class="record-list">
          <view v-for="item in filteredRecords" :key="item.id" class="record-card app-card">
            <image class="record-cover" :src="item.photoPath || '/static/placeholder.png'" mode="aspectFill" />
            <view class="record-body">
              <view class="record-top">
                <view class="record-title">{{ item.photoName }}</view>
                <view :class="['app-pill', item.status === 'success' ? 'is-online' : 'is-offline']">
                  <text>{{ formatCastStatus(item.status) }}</text>
                </view>
              </view>
              <view class="record-desc">{{ item.deviceName }} · {{ formatDateLabel(item.createdAt) }}</view>
              <view class="record-desc">{{ item.message }}</view>
              <view class="record-actions">
                <view class="mini-button" @click="retryCast(item.id)">再次投屏</view>
                <view class="mini-button danger" @click="deleteRecord(item.id)">删除记录</view>
              </view>
            </view>
          </view>
        </view>

        <view v-else-if="hasLogin" class="empty-card app-card">
          <view class="empty-title">还没有投屏记录</view>
          <view class="empty-desc">首页和我的相册里的投屏动作都会沉淀到这里，失败记录也会保留以便排查。</view>
        </view>

        <view v-else class="empty-card app-card">
          <view class="empty-title">请先登录</view>
          <view class="empty-desc">投屏记录属于当前微信手机号登录用户，未登录时不展示。</view>
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
  formatCastStatus,
  formatDateLabel,
  getCurrentScenarioUserId,
  getMyCastRecords,
} from '@/service/scenario'

const scenarioStore = useScenarioStore()
const userStore = useUserStore()

const activeFilter = ref<'all' | 'success' | 'failed'>('all')

const filters = [
  { label: '全部', value: 'all' },
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failed' },
] as const

const userId = computed(() => getCurrentScenarioUserId(userStore.userInfo.userid))
const hasLogin = computed(() => !!userStore.isLogined)
const records = computed(() => getMyCastRecords(scenarioStore.castRecords, userId.value))
const filteredRecords = computed(() => {
  if (activeFilter.value === 'all') return records.value
  return records.value.filter((item) => item.status === activeFilter.value)
})

function goMyCenter() {
  uni.switchTab({ url: SCENARIO_ROUTES.people })
}

function retryCast(recordId: string) {
  const target = records.value.find((item) => item.id === recordId)
  if (!target?.photoId) {
    uni.showToast({ title: '原始图片已不存在，无法重投', icon: 'none' })
    return
  }
  const result = scenarioStore.castSavedPhotosToDevice(target.deviceId, [target.photoId])
  if (!result.success && result.storageFull) {
    uni.showModal({
      title: '设备内存不足',
      content: '请先清理设备存储后重试。',
      showCancel: false,
    })
    return
  }
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
}

function deleteRecord(recordId: string) {
  const result = scenarioStore.removeCastRecord(recordId)
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
}

onShow(() => {
  scenarioStore.bootstrap()
})
</script>

<style scoped lang="scss">
.filter-bar,
.empty-card {
  padding: 24rpx;
}

.filter-bar {
  display: flex;
  gap: 16rpx;
}

.filter-chip {
  padding: 10rpx 18rpx;
  border-radius: var(--r-pill);
  background: var(--surface-soft);
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-500);
}

.filter-chip.is-active {
  background: var(--brand-50);
  color: var(--brand-700);
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-card {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
}

.record-cover {
  width: 136rpx;
  height: 136rpx;
  border-radius: 20rpx;
  flex-shrink: 0;
}

.record-body {
  flex: 1;
  min-width: 0;
}

.record-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.record-title,
.empty-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.record-desc,
.empty-desc {
  margin-top: 8rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.record-actions {
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

.mini-button.danger {
  background: var(--status-offline-bg);
  color: var(--status-offline-fg);
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
