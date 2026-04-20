<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '自定义主题',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="自定义主题">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="intro-card">
          <view class="intro-title">当前主题：{{ pageData.activeTheme }}</view>
          <view class="intro-description">这里保留主题色、卡片色和按钮色的静态演示，后续接用户个性化配置接口。</view>
        </view>

        <view class="palette-list">
          <view v-for="item in pageData.palettes" :key="item.title" class="palette-card">
            <view class="palette-header">
              <view class="palette-title">{{ item.title }}</view>
              <view class="palette-swatches">
                <view v-for="color in item.colors" :key="color" class="swatch" :style="{ background: color }"></view>
              </view>
            </view>
            <view class="palette-description">{{ item.description }}</view>
          </view>
        </view>

        <ApiDraftPanel :items="pageData.requestDrafts" />
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ApiDraftPanel from '@/components/scenario/ApiDraftPanel.vue'
import { getThemePageData, type ThemePageData } from '@/service/scenario'

const pageData = ref<ThemePageData | null>(null)

onLoad(async () => {
  pageData.value = await getThemePageData()
})
</script>

<style scoped lang="scss">
.intro-card,
.palette-card {
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.intro-card {
  padding: 28rpx;
  background:
    linear-gradient(180deg, rgba(49, 95, 203, 0.05) 0%, rgba(49, 95, 203, 0) 120rpx),
    var(--surface);
}

.intro-title,
.palette-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.intro-description,
.palette-description {
  margin-top: 12rpx;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-400);
}

.palette-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.palette-card {
  padding: 24rpx;
}

.palette-header {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.palette-swatches {
  display: flex;
  gap: 10rpx;
}

.swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.88);
  box-shadow: 0 6rpx 14rpx rgba(15, 23, 42, 0.08);
}
</style>
