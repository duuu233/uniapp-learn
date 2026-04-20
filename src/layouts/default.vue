<template>
  <wd-config-provider :themeVars="themeVars">
    <slot />
    <wd-toast />
    <wd-message-box />
    <wd-notify />
  </wd-config-provider>
  
</template>

<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'
const themeVars: ConfigProviderThemeVars = {
  colorTheme: '#315fcb',
  colorTitle: '#182235',
  colorContent: '#324154',
  colorSecondary: '#59677c',
  colorAid: '#7d899b',
  colorTip: '#9eabbd',
  colorBorder: 'rgba(15, 23, 42, 0.08)',
  colorBorderLight: 'rgba(15, 23, 42, 0.06)',
  colorBg: '#f5f7fb',
  buttonPrimaryBgColor: '#315fcb',
  buttonPrimaryColor: '#ffffff',
  buttonMediumHeight: '44px',
  buttonMediumRadius: '18px',
  cellTitleColor: '#182235',
  cellValueColor: '#59677c',
  cellTapBg: '#f2f5f9',
  popupCloseColor: '#7d899b',
  navbarColor: '#182235',
  navbarDescFontColor: '#59677c',
  navbarTitleFontWeight: '600',
  navbarBackground: 'transparent',
  textInfoColor: '#59677c',
}
</script>
