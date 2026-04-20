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
.page-scroll {
  background: #eef2f7;
}

.page-shell {
  padding: 16px 16px 28px;
}

.intro-card,
.palette-card {
  border-radius: 20px;
  background: #fff;
}

.intro-card {
  padding: 18px;
}

.intro-title,
.palette-title {
  font-size: 16px;
  font-weight: 700;
  color: #1b2437;
}

.intro-description,
.palette-description {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.7;
  color: #7a8499;
}

.palette-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.palette-card {
  padding: 16px;
}

.palette-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.palette-swatches {
  display: flex;
  gap: 8px;
}

.swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}
</style>
