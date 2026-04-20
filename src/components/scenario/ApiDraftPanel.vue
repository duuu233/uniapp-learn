<template>
  <view class="panel app-card-elevated">
    <view class="panel-header">
      <view class="app-section-kicker">API Draft</view>
      <view class="panel-title">{{ title }}</view>
      <view class="panel-caption">后续直接替换为真实接口即可</view>
    </view>

    <view v-for="item in items" :key="`${item.method}-${item.path}`" class="draft-card app-card-soft">
      <view class="draft-top">
        <text :class="['method', item.method.toLowerCase()]">{{ item.method }}</text>
        <text class="label">{{ item.label }}</text>
      </view>
      <view class="path">{{ item.path }}</view>
      <view class="description">{{ item.description }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { RequestDraft } from '@/service/scenario'

withDefaults(
  defineProps<{
    title?: string
    items: RequestDraft[]
  }>(),
  {
    title: '请求层伪代码',
  },
)
</script>

<style scoped lang="scss">
.panel {
  padding: 28rpx;
}

.panel-header {
  margin-bottom: 20rpx;
}

.panel-title {
  margin-top: 14rpx;
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.panel-caption {
  margin-top: 8rpx;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-400);
}

.draft-card + .draft-card {
  margin-top: 16rpx;
}

.draft-card {
  padding: 22rpx;
}

.draft-top {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.method {
  padding: 4rpx 14rpx;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
}

.method.get {
  background: var(--brand-500);
}

.method.post {
  background: var(--status-online-fg);
}

.method.put {
  background: var(--status-pending-fg);
}

.label {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-900);
}

.path {
  margin-top: 12rpx;
  font-size: 12px;
  color: var(--brand-600);
  word-break: break-all;
}

.description {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-500);
}
</style>
