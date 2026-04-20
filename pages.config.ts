import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '设备管理',
    navigationBarBackgroundColor: '#f5f7fb',
    navigationBarTextStyle: 'black',
    backgroundColor: '#eef2f7',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#7a8499',
    selectedColor: '#1f6fff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    height: '52px',
    fontSize: '11px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/tabbar-home-2.png',
        selectedIconPath: 'static/tabbar/tabbar-home.png',
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        iconPath: 'static/tabbar/tabbar-workHome-2.png',
        selectedIconPath: 'static/tabbar/tabbar-workHome.png',
        pagePath: 'pages/device/deviceHub',
        text: '设备',
      },
      {
        iconPath: 'static/tabbar/tabbar-user-2.png',
        selectedIconPath: 'static/tabbar/tabbar-user.png',
        pagePath: 'pages/user/people',
        text: '我的',
      },
    ],
  },
})
