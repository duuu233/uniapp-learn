import dayjs from 'dayjs'
import type { DeviceRole, DeviceStatus, ScenarioCastRecord, ScenarioDevice, ScenarioPhoto } from './types'

export * from './types'
export * from './mp'

export const LOCAL_USER_ID = 'wx-local-user'

export const SCENARIO_ROUTES = {
  home: '/pages/index/index',
  deviceHub: '/pages/device/deviceHub',
  bindDevice: '/pages/device/bindDevice',
  searchDevice: '/pages/device/searchDevice',
  deviceConnect: '/pages/device/deviceConnect',
  devicePermissions: '/pages/device/devicePermissions',
  people: '/pages/user/people',
  miniLocation: '/pages/user/miniLocation',
  themeCenter: '/pages/user/themeCenter',
  profileInfo: '/pages/user/profileInfo',
  albumCenter: '/pages/user/albumCenter',
  castCenter: '/pages/user/complaintCenter',
  complaintCenter: '/pages/user/complaintCenter',
  guideCenter: '/pages/user/guideCenter',
  settingsCenter: '/pages/user/settingsCenter',
} as const

export function createScenarioId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function getCurrentScenarioUserId(userid?: string | number) {
  return userid ? String(userid) : ''
}

export function getDeviceRole(device: ScenarioDevice, userId: string): DeviceRole {
  if (!userId) return 'unbound'
  if (device.ownerUserId === userId) return 'owner'
  if (device.memberUserIds.includes(userId)) return 'user'
  return 'unbound'
}

export function getAccessibleDevices(devices: ScenarioDevice[], userId: string) {
  if (!userId) return []
  return devices.filter((item) => getDeviceRole(item, userId) !== 'unbound')
}

export function getMyPhotos(photos: ScenarioPhoto[], userId: string) {
  if (!userId) return []
  return photos
    .filter((item) => item.uploadedByUserId === userId)
    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
}

export function getMyCastRecords(records: ScenarioCastRecord[], userId: string) {
  if (!userId) return []
  return records
    .filter((item) => item.uploadedByUserId === userId)
    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
}

export function formatDeviceStatus(status: DeviceStatus) {
  if (status === 'online') return '在线'
  if (status === 'pending') return '待激活'
  return '离线'
}

export function formatDeviceStatusClass(status: DeviceStatus) {
  if (status === 'online') return 'is-online'
  if (status === 'pending') return 'is-pending'
  return 'is-offline'
}

export function formatCastStatus(status: ScenarioCastRecord['status']) {
  return status === 'success' ? '成功' : '失败'
}

export function formatRole(role: DeviceRole) {
  if (role === 'owner') return '所有者'
  if (role === 'user') return '使用者'
  return '未绑定'
}

export function formatBattery(level: number) {
  return `${Math.max(0, Math.min(100, Math.round(level)))}%`
}

export function formatSignal(level: number) {
  const clampLevel = Math.max(0, Math.min(4, Math.round(level)))
  return `蓝牙 ${clampLevel}/4`
}

export function formatStorage(device: ScenarioDevice) {
  return `${device.storageUsedMb} / ${device.storageTotalMb} MB`
}

export function formatStoragePercent(device: ScenarioDevice) {
  if (!device.storageTotalMb) return 0
  return Math.min(100, Math.round((device.storageUsedMb / device.storageTotalMb) * 100))
}

export function formatDateLabel(value: string) {
  return dayjs(value).format('MM-DD HH:mm')
}

export function formatRelativeLabel(value: string) {
  const now = dayjs()
  const target = dayjs(value)
  const diffMinute = now.diff(target, 'minute')
  if (diffMinute < 1) return '刚刚'
  if (diffMinute < 60) return `${diffMinute} 分钟前`
  const diffHour = now.diff(target, 'hour')
  if (diffHour < 24) return `${diffHour} 小时前`
  return target.format('MM-DD HH:mm')
}

export function buildDiscoveryCandidates(devices: ScenarioDevice[]) {
  const existing = devices.map((item, index) => ({
    id: item.id,
    name: item.name,
    serialNumber: item.serialNumber,
    signalLevel: Math.max(1, item.signalLevel || (4 - (index % 3))),
    type: item.type,
    location: item.location,
  }))

  return [
    ...existing,
    {
      id: 'discover-frame-lite',
      name: '大厅电子相框 Lite',
      serialNumber: 'SN-D90421',
      signalLevel: 4,
      type: '电子相框',
      location: '展厅入口',
    },
    {
      id: 'discover-bridge-mini',
      name: '边缘桥接器 Mini',
      serialNumber: 'SN-E77219',
      signalLevel: 3,
      type: '桥接器',
      location: '仓储区东侧',
    },
  ]
}
