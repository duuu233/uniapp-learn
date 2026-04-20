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
      <view v-if="pageData" class="page-shell">
        <view class="album-grid">
          <view v-for="item in pageData.albums" :key="item.title" class="album-card">
            <view class="album-cover">{{ item.coverLabel }}</view>
            <view class="album-title">{{ item.title }}</view>
            <view class="album-meta">{{ item.count }} · {{ item.updatedAt }}</view>
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
import { getAlbumPageData, type AlbumPageData } from '@/service/scenario'

const pageData = ref<AlbumPageData | null>(null)

onLoad(async () => {
  pageData.value = await getAlbumPageData()
})
</script>

<style scoped lang="scss">
.album-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.album-card {
  padding: 22rpx;
  border: 1rpx solid var(--hairline);
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.album-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, #e5edff 0%, #f7f9fd 100%);
  font-size: 28px;
  font-weight: 800;
  color: var(--brand-600);
}

.album-title {
  margin-top: 16rpx;
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-900);
}

.album-meta {
  margin-top: 10rpx;
  font-size: 12px;
  color: var(--ink-400);
}
</style>
