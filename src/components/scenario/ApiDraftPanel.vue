<template>
  <view class="panel">
    <view class="panel-header">
      <view class="panel-title">{{ title }}</view>
      <view class="panel-caption">后续直接替换为真实接口即可</view>
    </view>

    <view v-for="item in items" :key="`${item.method}-${item.path}`" class="draft-card">
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
  padding: 20px;
  border-radius: 20px;
  background: #fff;
}

.panel-header {
  margin-bottom: 14px;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: #1b2437;
}

.panel-caption {
  margin-top: 4px;
  font-size: 12px;
  color: #7a8499;
}

.draft-card + .draft-card {
  margin-top: 12px;
}

.draft-card {
  padding: 14px;
  border-radius: 16px;
  background: #f5f7fb;
}

.draft-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.method {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
}

.method.get {
  background: #2563eb;
}

.method.post {
  background: #059669;
}

.method.put {
  background: #d97706;
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: #1b2437;
}

.path {
  margin-top: 8px;
  font-size: 12px;
  color: #2563eb;
  word-break: break-all;
}

.description {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #576074;
}
</style>
