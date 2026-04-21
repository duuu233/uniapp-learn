<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设置',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="设置">
    <scroll-view scroll-y class="page-scroll">
      <view class="page-shell">
        <view class="setting-card app-card">
          <view class="setting-row">
            <view>
              <view class="setting-title">消息通知</view>
              <view class="setting-desc">设备异常、投屏失败和系统提示统一走这里。</view>
            </view>
            <switch :checked="scenarioStore.settings.messageNotifications" color="#315fcb" @change="toggleNotify" />
          </view>
        </view>

        <view class="setting-card app-card" @click="showTextModal('关于我们', scenarioStore.settings.aboutText)">
          <view class="setting-title">关于我们</view>
          <view class="setting-desc">{{ scenarioStore.settings.companyName }}</view>
        </view>

        <view class="setting-card app-card" @click="copyContact">
          <view class="setting-title">联系方式</view>
          <view class="setting-desc">电话 {{ scenarioStore.settings.contactPhone }} · 微信 {{ scenarioStore.settings.contactWechat }}</view>
        </view>

        <view class="setting-card app-card" @click="showTextModal('隐私政策', scenarioStore.settings.privacyPolicy)">
          <view class="setting-title">隐私政策</view>
          <view class="setting-desc">说明定位、相机、相册、蓝牙和手机号快捷登录的使用范围。</view>
        </view>

        <view class="setting-card app-card" @click="showTextModal('用户协议', scenarioStore.settings.userAgreement)">
          <view class="setting-title">用户协议</view>
          <view class="setting-desc">说明设备所有者权限、相册删除和投屏行为影响。</view>
        </view>

        <view class="setting-card app-card danger-card" @click="confirmDeleteAccount">
          <view class="setting-title danger-text">用户注销</view>
          <view class="setting-desc">清空当前登录用户资料、本地设备绑定关系和投屏数据。</view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useScenarioStore } from '@/store'
import { SCENARIO_ROUTES } from '@/service/scenario'

const scenarioStore = useScenarioStore()

function toggleNotify(event: Record<string, any>) {
  scenarioStore.toggleMessageNotifications(!!event.detail.value)
  uni.showToast({ title: '设置已保存', icon: 'success' })
}

function showTextModal(title: string, content: string) {
  uni.showModal({
    title,
    content,
    showCancel: false,
  })
}

function copyContact() {
  uni.setClipboardData({
    data: `${scenarioStore.settings.contactPhone} / ${scenarioStore.settings.contactWechat}`,
    success: () => uni.showToast({ title: '联系方式已复制', icon: 'success' }),
  })
}

function confirmDeleteAccount() {
  uni.showModal({
    title: '确认注销',
    content: '注销后会清空当前用户的本地登录、相册、投屏记录和设备权限数据。',
    confirmColor: '#c24141',
    success: ({ confirm }) => {
      if (!confirm) return
      scenarioStore.resetForAccountDeletion()
      uni.showToast({ title: '账号已注销', icon: 'success' })
      uni.switchTab({ url: SCENARIO_ROUTES.home })
    },
  })
}

onShow(() => {
  scenarioStore.bootstrap()
})
</script>

<style scoped lang="scss">
.setting-card {
  padding: 24rpx;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.setting-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.setting-desc {
  margin-top: 10rpx;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-400);
}

.danger-card {
  border-color: rgba(194, 65, 65, 0.18);
  background: linear-gradient(180deg, #fffafa 0%, #fff4f4 100%);
}

.danger-text {
  color: var(--status-offline-fg);
}
</style>
