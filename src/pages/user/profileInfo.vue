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
      <view class="page-shell">
        <view v-if="hasLogin" class="profile-card app-card">
          <image class="avatar" :src="userStore.userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
          <view class="avatar-actions">
            <view class="light-button" @click="syncWechatProfile">同步微信头像昵称</view>
            <view class="light-button" @click="chooseAvatar">从相册选择头像</view>
          </view>
        </view>

        <view v-if="hasLogin" class="form-card app-card">
          <view class="field-label">昵称</view>
          <input v-model="nickname" class="text-input" maxlength="20" placeholder="请输入昵称" />

          <view class="field-label top-gap">手机号</view>
          <view class="field-value">{{ userStore.userInfo.phone || '138****1024' }}</view>

          <view class="field-label top-gap">用户 ID</view>
          <view class="field-value">{{ userStore.userInfo.userid }}</view>

          <button class="primary-button" @click="saveProfile">保存资料</button>
        </view>

        <view v-else class="empty-card app-card">
          <view class="empty-title">请先完成登录</view>
          <view class="empty-desc">个人信息依赖微信绑定手机号快捷登录，登录后才会生成用户 ID、头像和昵称。</view>
          <button class="primary-button" @click="goMyCenter">去我的页面登录</button>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { chooseProfileAvatarFromAlbum, syncWechatProfileToStore, updateMiniProfile } from '@/service/scenario/account'

const userStore = useUserStore()
const nickname = ref('')

const hasLogin = computed(() => !!userStore.isLogined)

function syncDraft() {
  nickname.value = userStore.userInfo.realname || userStore.userInfo.username || ''
}

async function syncWechatProfile() {
  try {
    await syncWechatProfileToStore()
    syncDraft()
    uni.showToast({ title: '微信头像昵称已同步', icon: 'success' })
  } catch {
    uni.showToast({ title: '你取消了微信资料授权', icon: 'none' })
  }
}

async function chooseAvatar() {
  try {
    await chooseProfileAvatarFromAlbum()
    uni.showToast({ title: '头像已更新', icon: 'success' })
  } catch {
    uni.showToast({ title: '未选择头像', icon: 'none' })
  }
}

function saveProfile() {
  const result = updateMiniProfile(nickname.value)
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
}

function goMyCenter() {
  uni.switchTab({ url: '/pages/user/people' })
}

onShow(() => {
  syncDraft()
})
</script>

<style scoped lang="scss">
.profile-card,
.form-card,
.empty-card {
  padding: 28rpx 24rpx;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 30rpx;
  flex-shrink: 0;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  flex: 1;
}

.light-button {
  padding: 14rpx 18rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-700);
}

.field-label,
.empty-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-400);
}

.top-gap {
  margin-top: 20rpx;
}

.field-value {
  margin-top: 10rpx;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-900);
}

.text-input {
  margin-top: 10rpx;
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: var(--r-md);
  background: var(--surface-soft);
  color: var(--ink-900);
  font-size: 15px;
}

.primary-button {
  margin-top: 28rpx;
  border: none;
  border-radius: 18px;
  background: var(--brand-grad);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}

.empty-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.empty-desc {
  margin-top: 12rpx;
}
</style>
