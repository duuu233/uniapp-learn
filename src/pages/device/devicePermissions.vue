<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '权限说明',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="权限说明">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="intro-card">{{ pageData.intro }}</view>

        <view class="permission-list">
          <view v-for="item in pageData.permissions" :key="`${item.platform}-${item.title}`" class="permission-card">
            <view class="permission-top">
              <view>
                <view class="permission-title">{{ item.title }}</view>
                <view class="permission-platform">{{ item.platform }}</view>
              </view>
              <view :class="['permission-flag', item.required ? 'required' : 'optional']">
                {{ item.required ? '必需' : '可选' }}
              </view>
            </view>
            <view class="permission-description">{{ item.description }}</view>
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
import { getPermissionPageData, type PermissionPageData } from '@/service/scenario'

const pageData = ref<PermissionPageData | null>(null)

onLoad(async () => {
  pageData.value = await getPermissionPageData()
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
.permission-card {
  border-radius: 20px;
  background: #fff;
}

.intro-card {
  padding: 18px;
  font-size: 13px;
  line-height: 1.8;
  color: #576074;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.permission-card {
  padding: 16px;
}

.permission-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.permission-title {
  font-size: 15px;
  font-weight: 700;
  color: #1b2437;
}

.permission-platform,
.permission-description {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.permission-flag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.permission-flag.required {
  background: #fee2e2;
  color: #dc2626;
}

.permission-flag.optional {
  background: #eef4ff;
  color: #1f6fff;
}
</style>
