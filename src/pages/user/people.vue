<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout :navbarShow="false">
    <scroll-view scroll-y class="page-scroll">
      <view v-if="pageData" class="page-shell">
        <view class="profile-card">
          <view class="avatar">{{ pageData.profile.name.slice(0, 1) }}</view>
          <view class="profile-body">
            <view class="profile-name">{{ pageData.profile.name }}</view>
            <view class="profile-role">{{ pageData.profile.role }} · {{ pageData.profile.company }}</view>
            <view class="profile-slogan">{{ pageData.profile.slogan }}</view>
          </view>
        </view>

        <view v-for="group in pageData.menuGroups" :key="group.title" class="section">
          <view class="section-title">{{ group.title }}</view>
          <view class="menu-list">
            <view
              v-for="item in group.items"
              :key="item.title"
              class="menu-item"
              @click="openRoute(item.url, item.isTab)"
            >
              <view class="menu-main">
                <view class="menu-title">{{ item.title }}</view>
                <view class="menu-subtitle">{{ item.subtitle }}</view>
              </view>
              <view class="menu-badge">{{ item.badge }}</view>
            </view>
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
import { getMyCenterPageData, type MyCenterPageData } from '@/service/scenario'

const pageData = ref<MyCenterPageData | null>(null)

const openRoute = (url: string, isTab = false) => {
  if (isTab) {
    uni.switchTab({ url })
    return
  }

  uni.navigateTo({ url })
}

onLoad(async () => {
  pageData.value = await getMyCenterPageData()
})
</script>

<style scoped lang="scss">
.page-scroll {
  background: linear-gradient(180deg, #eef4ff 0%, #f5f7fb 40%, #eef2f7 100%);
}

.page-shell {
  padding: 18px 16px 28px;
}

.profile-card,
.section {
  border-radius: 22px;
  background: #fff;
}

.profile-card {
  display: flex;
  gap: 14px;
  padding: 20px;
  background: linear-gradient(135deg, #1b2437, #304566);
  color: #fff;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 24px;
  font-weight: 700;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
}

.profile-role,
.profile-slogan {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.section {
  margin-top: 16px;
  padding: 18px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1b2437;
}

.menu-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 18px;
  background: #f5f7fb;
}

.menu-title {
  font-size: 15px;
  font-weight: 600;
  color: #1b2437;
}

.menu-subtitle {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #7a8499;
}

.menu-badge {
  padding: 4px 10px;
  border-radius: 999px;
  background: #dbe7ff;
  font-size: 11px;
  color: #1f6fff;
}
</style>
