import { useUserStore } from '@/store'
import { LOCAL_USER_ID } from './index'
import { pickScenarioImages, saveLocalFileIfNeeded } from './mp'

const DEFAULT_AVATAR = '/static/default-avatar.png'

function buildBaseUserInfo() {
  const userStore = useUserStore()
  return {
    ...userStore.userInfo,
    token: userStore.userInfo.token || `mini-token-${Date.now()}`,
    userid: LOCAL_USER_ID,
    username: userStore.userInfo.username || '微信用户',
    realname: userStore.userInfo.realname || '微信用户',
    avatar: userStore.userInfo.avatar || DEFAULT_AVATAR,
    phone: userStore.userInfo.phone || '138****1024',
    email: userStore.userInfo.email || '',
    openid: userStore.userInfo.openid || 'wx-local-openid',
    localStorageTime: Date.now(),
  } satisfies IUserInfo
}

export function ensureMiniProgramUser() {
  const userStore = useUserStore()
  if (!userStore.userInfo.userid) {
    userStore.setUserInfo(buildBaseUserInfo())
  }
  return userStore
}

export function handleWechatPhoneQuickLogin(detail?: Record<string, any>) {
  const isSuccess = detail?.errMsg?.includes('ok') || detail?.code || detail?.encryptedData
  if (!isSuccess) {
    return { success: false, message: '未完成手机号授权。' }
  }

  const userStore = useUserStore()
  userStore.setUserInfo(buildBaseUserInfo())
  return { success: true, message: '微信绑定手机号快捷登录成功。' }
}

export async function syncWechatProfileToStore() {
  const userStore = ensureMiniProgramUser()

  const profile = await new Promise<UniApp.GetUserProfileRes>((resolve, reject) => {
    uni.getUserProfile({
      desc: '用于同步微信头像和昵称',
      success: (res) => resolve(res),
      fail: (error) => reject(error),
    })
  })

  const userInfo = profile.userInfo || {}
  userStore.editUserInfo({
    username: userInfo.nickName || userStore.userInfo.username,
    realname: userInfo.nickName || userStore.userInfo.realname,
    avatar: userInfo.avatarUrl || userStore.userInfo.avatar,
    sex: userInfo.gender || userStore.userInfo.sex,
    localStorageTime: Date.now(),
  })
  return profile
}

export async function chooseProfileAvatarFromAlbum() {
  const userStore = ensureMiniProgramUser()
  const files = await pickScenarioImages('album', 1)
  const first = files[0]
  if (!first) return ''
  const filePath = await saveLocalFileIfNeeded(first.tempFilePath)
  userStore.editUserInfo({
    avatar: filePath,
    localStorageTime: Date.now(),
  })
  return filePath
}

export function updateMiniProfile(nickname: string) {
  const userStore = ensureMiniProgramUser()
  const nextName = nickname.trim()
  if (!nextName) {
    return { success: false, message: '昵称不能为空。' }
  }
  userStore.editUserInfo({
    username: nextName,
    realname: nextName,
    localStorageTime: Date.now(),
  })
  return { success: true, message: '个人信息已保存。' }
}
