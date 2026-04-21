<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '主题说明',
    disableScroll: true,
    'app-plus': {
      bounce: 'none',
    },
  },
}
</route>

<template>
  <PageLayout navTitle="主题说明">
    <scroll-view scroll-y class="page-scroll">
      <view class="page-shell">
        <view class="info-card app-card">
          <view class="info-title">微信小程序版本不提供主题切换</view>
          <view class="info-desc">
            本次需求以微信小程序为唯一交付目标，因此未实现 App 端自定义主题、语种切换和邮箱注册相关能力。
          </view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<style scoped lang="scss">
.info-card {
  padding: 28rpx 24rpx;
}

.info-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-900);
}

.info-desc {
  margin-top: 12rpx;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-400);
}
</style>
