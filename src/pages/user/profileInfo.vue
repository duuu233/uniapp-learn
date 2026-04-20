<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '个人信息',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="个人信息">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="field-list">
          <view v-for="item in pageData.fields" :key="item.label" class="field-card">
            <view class="field-label">{{ item.label }}</view>
            <view class="field-value">{{ item.value }}</view>
            <view class="field-description">{{ item.description }}</view>
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
import { getProfilePageData, type ProfilePageData } from '@/service/scenario'

const pageData = ref<ProfilePageData | null>(null)

onLoad(async () => {
  pageData.value = await getProfilePageData()
})
</script>

<style scoped lang="scss">
.page-scroll {
  background: #eef2f7;
}

.page-shell {
  padding: 16px 16px 28px;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.field-card {
  padding: 16px;
  border-radius: 20px;
  background: #fff;
}

.field-label,
.field-description {
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.field-value {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1b2437;
}

.field-description {
  margin-top: 6px;
}
</style>
