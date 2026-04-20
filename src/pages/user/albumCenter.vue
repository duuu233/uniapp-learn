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
.page-scroll {
  background: #eef2f7;
}

.page-shell {
  padding: 16px 16px 28px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.album-card {
  padding: 14px;
  border-radius: 20px;
  background: #fff;
}

.album-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
  border-radius: 16px;
  background: linear-gradient(135deg, #dbe7ff, #eef4ff);
  font-size: 28px;
  font-weight: 700;
  color: #1f6fff;
}

.album-title {
  margin-top: 12px;
  font-size: 15px;
  font-weight: 700;
  color: #1b2437;
}

.album-meta {
  margin-top: 6px;
  font-size: 12px;
  color: #7a8499;
}
</style>
