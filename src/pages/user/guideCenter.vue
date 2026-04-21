<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '操作指南',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="操作指南">
    <scroll-view scroll-y class="page-scroll">
      <view class="page-shell">
        <view class="filter-bar app-card">
          <view
            v-for="item in deviceTypes"
            :key="item"
            :class="['filter-chip', activeType === item ? 'is-active' : '']"
            @click="activeType = item"
          >
            {{ item }}
          </view>
        </view>

        <view class="guide-list">
          <view v-for="item in visibleGuides" :key="item.id" class="guide-card app-card">
            <view class="guide-top" @click="toggleGuide(item.id)">
              <view>
                <view class="guide-type">{{ item.deviceType }}</view>
                <view class="guide-title">{{ item.title }}</view>
              </view>
              <text class="guide-arrow">{{ expandedId === item.id ? '−' : '+' }}</text>
            </view>
            <view class="guide-summary">{{ item.summary }}</view>
            <view v-if="expandedId === item.id" class="guide-detail">
              <view v-for="(point, index) in item.bullets" :key="point" class="guide-bullet">
                <text class="guide-index">{{ index + 1 }}</text>
                <text class="guide-text">{{ point }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="contact-card app-card">
          <view class="guide-title">仍然有问题？</view>
          <view class="guide-summary">可在设置页查看完整联系方式，也可以直接复制客服微信。</view>
          <view class="copy-button" @click="copyWechat">复制客服微信：lingjing-support</view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useScenarioStore } from '@/store'

const scenarioStore = useScenarioStore()
const activeType = ref('全部')
const expandedId = ref('')

const deviceTypes = computed(() => ['全部', ...new Set(scenarioStore.guides.map((item) => item.deviceType))])
const visibleGuides = computed(() => {
  if (activeType.value === '全部') return scenarioStore.guides
  return scenarioStore.guides.filter((item) => item.deviceType === activeType.value)
})

function toggleGuide(guideId: string) {
  expandedId.value = expandedId.value === guideId ? '' : guideId
}

function copyWechat() {
  uni.setClipboardData({
    data: 'lingjing-support',
    success: () => uni.showToast({ title: '客服微信已复制', icon: 'success' }),
  })
}

onShow(() => {
  scenarioStore.bootstrap()
})
</script>

<style scoped lang="scss">
.filter-bar,
.contact-card {
  padding: 24rpx;
}

.filter-bar {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
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

.guide-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.guide-card {
  padding: 24rpx;
}

.guide-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.guide-type {
  display: inline-flex;
  padding: 6rpx 14rpx;
  border-radius: var(--r-pill);
  background: var(--brand-50);
  font-size: 11px;
  font-weight: 700;
  color: var(--brand-700);
}

.guide-title {
  margin-top: 12rpx;
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.guide-arrow {
  font-size: 22px;
  color: var(--ink-300);
}

.guide-summary,
.guide-text {
  margin-top: 12rpx;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-400);
}

.guide-detail {
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid var(--hairline);
}

.guide-bullet {
  display: flex;
  gap: 12rpx;
}

.guide-bullet + .guide-bullet {
  margin-top: 14rpx;
}

.guide-index {
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  border-radius: 50%;
  background: var(--brand-50);
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-700);
  flex-shrink: 0;
}

.copy-button {
  margin-top: 18rpx;
  padding: 14rpx 18rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-700);
}
</style>
