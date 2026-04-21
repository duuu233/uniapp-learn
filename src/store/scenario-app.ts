import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import {
  LOCAL_USER_ID,
  createScenarioId,
  formatDateLabel,
  getCurrentScenarioUserId,
} from '@/service/scenario'
import { removeLocalFileIfNeeded, saveLocalFileIfNeeded } from '@/service/scenario/mp'
import type {
  BindDevicePayload,
  CastActionResult,
  DraftPhotoInput,
  ScenarioActionResult,
  ScenarioAppState,
  ScenarioCastRecord,
  ScenarioDevice,
  ScenarioGuideDoc,
  ScenarioLocationTrack,
  ScenarioPhoto,
  ScenarioSettings,
} from '@/service/scenario'

const DEFAULT_SETTINGS: ScenarioSettings = {
  messageNotifications: true,
  companyName: '灵境智显科技',
  contactPhone: '400-820-2026',
  contactWechat: 'lingjing-support',
  aboutText:
    '灵境智显科技专注于相框设备、蓝牙配网和小程序投屏场景。本项目默认以微信小程序为运行端，数据全部落在本地持久化层，后续可平滑替换为真实接口。',
  privacyPolicy:
    '我们仅在你主动使用定位、蓝牙、相机、相册和微信手机号快捷登录时请求对应能力，用于设备发现、投屏与资料展示，不会在未授权时后台采集。',
  userAgreement:
    '使用本程序即表示你同意：上传内容需拥有合法使用权；设备投屏、删除和一键清空等操作会影响目标设备内容；所有者拥有设备名称、轮播和存储清理权限。',
}

function createSeedDevices() {
  return [
    {
      id: 'device-main-frame',
      serialNumber: 'SN-A10234',
      name: '前台主相框',
      type: '电子相框',
      location: '总部前台',
      note: '默认展示企业宣传照',
      status: 'online',
      batteryLevel: 81,
      signalLevel: 4,
      lastSeenAt: dayjs().subtract(3, 'minute').toISOString(),
      ownerUserId: LOCAL_USER_ID,
      ownerName: '微信用户',
      memberUserIds: [],
      storageTotalMb: 256,
      storageUsedMb: 46,
      slideshowEnabled: true,
      connectionState: 'connected',
    },
    {
      id: 'device-meeting-frame',
      serialNumber: 'SN-B77891',
      name: '会议室展示屏',
      type: '电子相框',
      location: 'A 栋 6F 会议室',
      note: '支持蓝牙快速连接',
      status: 'online',
      batteryLevel: 64,
      signalLevel: 3,
      lastSeenAt: dayjs().subtract(20, 'minute').toISOString(),
      ownerUserId: 'ops-admin',
      ownerName: '运维管理员',
      memberUserIds: [LOCAL_USER_ID],
      storageTotalMb: 512,
      storageUsedMb: 128,
      slideshowEnabled: false,
      connectionState: 'disconnected',
    },
    {
      id: 'device-gate-frame',
      serialNumber: 'SN-C53128',
      name: '园区门禁副屏',
      type: '电子相框',
      location: '北门门岗',
      note: '等待首次激活',
      status: 'pending',
      batteryLevel: 100,
      signalLevel: 2,
      lastSeenAt: dayjs().subtract(1, 'day').toISOString(),
      ownerUserId: null,
      ownerName: '未设置',
      memberUserIds: [],
      storageTotalMb: 256,
      storageUsedMb: 0,
      slideshowEnabled: false,
      connectionState: 'disconnected',
    },
  ] satisfies ScenarioDevice[]
}

function createSeedPhotos() {
  return [
    {
      id: 'photo-seed-1',
      name: '品牌主视觉.jpg',
      filePath: '/static/image.png',
      thumbnailPath: '/static/image.png',
      createdAt: dayjs().subtract(2, 'day').toISOString(),
      uploadedByUserId: LOCAL_USER_ID,
      uploadedByName: '微信用户',
      source: 'album',
      sizeKb: 1820,
      width: 1280,
      height: 960,
      deviceIds: ['device-main-frame'],
      isLocalAsset: true,
    },
    {
      id: 'photo-seed-2',
      name: '前台活动照.jpg',
      filePath: '/static/placeholder.png',
      thumbnailPath: '/static/placeholder.png',
      createdAt: dayjs().subtract(1, 'day').toISOString(),
      uploadedByUserId: LOCAL_USER_ID,
      uploadedByName: '微信用户',
      source: 'camera',
      sizeKb: 2680,
      width: 1600,
      height: 1200,
      deviceIds: ['device-main-frame', 'device-meeting-frame'],
      isLocalAsset: true,
    },
  ] satisfies ScenarioPhoto[]
}

function createSeedCastRecords() {
  return [
    {
      id: 'record-seed-1',
      photoId: 'photo-seed-1',
      photoName: '品牌主视觉.jpg',
      photoPath: '/static/image.png',
      deviceId: 'device-main-frame',
      deviceName: '前台主相框',
      status: 'success',
      message: '已投屏到前台主相框',
      createdAt: dayjs().subtract(2, 'day').toISOString(),
      uploadedByUserId: LOCAL_USER_ID,
    },
    {
      id: 'record-seed-2',
      photoId: 'photo-seed-2',
      photoName: '前台活动照.jpg',
      photoPath: '/static/placeholder.png',
      deviceId: 'device-meeting-frame',
      deviceName: '会议室展示屏',
      status: 'failed',
      message: '设备离线，已保留重投入口',
      createdAt: dayjs().subtract(5, 'hour').toISOString(),
      uploadedByUserId: LOCAL_USER_ID,
    },
  ] satisfies ScenarioCastRecord[]
}

function createSeedGuides() {
  return [
    {
      id: 'guide-frame-bind',
      deviceType: '电子相框',
      title: '电子相框绑定流程',
      summary: '适用于支持蓝牙发现和 SN 绑定的标准相框设备。',
      bullets: ['先打开蓝牙搜索，再扫描设备二维码或输入 SN。', '首次绑定成功后会自动设为当前设备，后续投屏默认使用当前设备。', '若设备已有所有者，你会以“使用者”身份加入，管理权限需由当前所有者转移。'],
    },
    {
      id: 'guide-cast-fail',
      deviceType: '投屏故障',
      title: '投屏失败自查',
      summary: '优先排查存储空间、连接状态和图片数量。',
      bullets: ['设备内存不足时会直接拦截投屏，并保留失败记录。', '图片已经存在于目标设备中时，不会重复占用空间。', '蓝牙连接失败时可在“设备连接”中重新扫描。'],
    },
    {
      id: 'guide-location',
      deviceType: '定位与权限',
      title: '定位与权限说明',
      summary: '小程序端仅在你主动点击时获取定位。',
      bullets: ['定位用于标记设备最近一次操作地点，不做后台持续采集。', '蓝牙能力用于发现设备，实际连接成败取决于系统蓝牙状态。', '微信绑定手机号快捷登录仅用于确认当前操作者身份。'],
    },
  ] satisfies ScenarioGuideDoc[]
}

function createSeedLocationTracks() {
  return [
    {
      id: 'track-seed-1',
      deviceId: 'device-main-frame',
      latitude: 30.2741,
      longitude: 120.1551,
      name: '总部前台',
      createdAt: dayjs().subtract(3, 'hour').toISOString(),
    },
    {
      id: 'track-seed-2',
      deviceId: 'device-main-frame',
      latitude: 30.2746,
      longitude: 120.1559,
      name: '前台接待区',
      createdAt: dayjs().subtract(90, 'minute').toISOString(),
    },
    {
      id: 'track-seed-3',
      deviceId: 'device-meeting-frame',
      latitude: 30.2752,
      longitude: 120.1568,
      name: 'A 栋 6F 会议室',
      createdAt: dayjs().subtract(50, 'minute').toISOString(),
    },
  ] satisfies ScenarioLocationTrack[]
}

function createDefaultState(): ScenarioAppState {
  return {
    initialized: false,
    currentDeviceId: '',
    devices: [],
    photos: [],
    castRecords: [],
    guides: [],
    settings: { ...DEFAULT_SETTINGS },
    locationTracks: [],
  }
}

function getCurrentUserContext() {
  const userStore = useUserStore()
  const userId = getCurrentScenarioUserId(userStore.userInfo.userid)
  return {
    userStore,
    userId,
    userName: userStore.userInfo.realname || userStore.userInfo.username || '微信用户',
  }
}

function findDeviceIndex(devices: ScenarioDevice[], deviceId: string) {
  return devices.findIndex((item) => item.id === deviceId)
}

function getPhotoSizeMb(sizeKb: number) {
  return Math.max(1, Math.ceil(sizeKb / 1024))
}

export const useScenarioStore = defineStore(
  'scenario-app',
  {
    state: (): ScenarioAppState => createDefaultState(),
    actions: {
      bootstrap() {
        if (this.initialized) return
        this.devices = createSeedDevices()
        this.photos = createSeedPhotos()
        this.castRecords = createSeedCastRecords()
        this.guides = createSeedGuides()
        this.settings = { ...DEFAULT_SETTINGS }
        this.locationTracks = createSeedLocationTracks()
        this.currentDeviceId = this.devices[0]?.id || ''
        this.initialized = true
      },
      setCurrentDevice(deviceId: string) {
        if (this.devices.some((item) => item.id === deviceId)) {
          this.currentDeviceId = deviceId
        }
      },
      bindDevice(payload: BindDevicePayload): ScenarioActionResult {
        const { userId, userName } = getCurrentUserContext()
        if (!userId) {
          return { success: false, message: '请先完成微信手机号快捷登录。' }
        }

        const serialNumber = payload.serialNumber.trim().toUpperCase()
        if (!serialNumber) {
          return { success: false, message: '请输入设备 SN 码。' }
        }

        const existed = this.devices.find((item) => item.serialNumber === serialNumber)
        if (existed) {
          if (existed.ownerUserId === userId || existed.memberUserIds.includes(userId)) {
            if (payload.name && existed.ownerUserId === userId) existed.name = payload.name.trim()
            if (payload.location && existed.ownerUserId === userId) existed.location = payload.location.trim()
            this.currentDeviceId = existed.id
            return { success: true, message: '设备已在你的列表中，已切换为当前设备。', deviceId: existed.id }
          }

          if (!existed.ownerUserId) {
            existed.ownerUserId = userId
            existed.ownerName = userName
            existed.name = payload.name.trim() || existed.name
            existed.location = payload.location.trim() || existed.location
            existed.note = payload.note.trim() || existed.note
            existed.status = 'pending'
            this.currentDeviceId = existed.id
            return { success: true, message: '绑定成功，你已成为该设备所有者。', deviceId: existed.id }
          }

          existed.memberUserIds = Array.from(new Set([...existed.memberUserIds, userId]))
          this.currentDeviceId = existed.id
          return { success: true, message: '绑定成功，已加入设备使用者列表。', deviceId: existed.id }
        }

        const deviceId = createScenarioId('device')
        this.devices.unshift({
          id: deviceId,
          serialNumber,
          name: payload.name.trim() || `新设备 ${serialNumber.slice(-4)}`,
          type: '电子相框',
          location: payload.location.trim() || '待补充位置',
          note: payload.note.trim() || '通过小程序创建',
          status: 'pending',
          batteryLevel: 100,
          signalLevel: 3,
          lastSeenAt: dayjs().toISOString(),
          ownerUserId: userId,
          ownerName: userName,
          memberUserIds: [],
          storageTotalMb: 256,
          storageUsedMb: 0,
          slideshowEnabled: false,
          connectionState: 'disconnected',
        })
        this.currentDeviceId = deviceId
        return { success: true, message: '绑定成功，设备已加入你的设备列表。', deviceId }
      },
      renameDevice(deviceId: string, nextName: string): ScenarioActionResult {
        const { userId } = getCurrentUserContext()
        const index = findDeviceIndex(this.devices, deviceId)
        if (index < 0) return { success: false, message: '设备不存在。' }
        const device = this.devices[index]
        if (device.ownerUserId !== userId) {
          return { success: false, message: '只有设备所有者可以修改设备名称。' }
        }
        const name = nextName.trim()
        if (!name) return { success: false, message: '设备名称不能为空。' }
        device.name = name
        return { success: true, message: '设备名称已更新。', deviceId }
      },
      claimDeviceOwner(deviceId: string): ScenarioActionResult {
        const { userId, userName } = getCurrentUserContext()
        const index = findDeviceIndex(this.devices, deviceId)
        if (!userId) return { success: false, message: '请先登录后再操作。' }
        if (index < 0) return { success: false, message: '设备不存在。' }
        const device = this.devices[index]
        if (device.ownerUserId && device.ownerUserId !== userId) {
          return { success: false, message: `当前设备已有所有者：${device.ownerName}` }
        }
        device.ownerUserId = userId
        device.ownerName = userName
        if (!device.memberUserIds.includes(userId)) {
          device.memberUserIds.push(userId)
        }
        return { success: true, message: '已设置为当前设备所有者。', deviceId }
      },
      toggleSlideshow(deviceId: string, enabled: boolean): ScenarioActionResult {
        const { userId } = getCurrentUserContext()
        const index = findDeviceIndex(this.devices, deviceId)
        if (index < 0) return { success: false, message: '设备不存在。' }
        if (this.devices[index].ownerUserId !== userId) {
          return { success: false, message: '只有所有者可以调整轮播模式。' }
        }
        this.devices[index].slideshowEnabled = enabled
        return { success: true, message: enabled ? '已开启轮播模式。' : '已关闭轮播模式。', deviceId }
      },
      clearDeviceStorage(deviceId: string): ScenarioActionResult {
        const { userId } = getCurrentUserContext()
        const index = findDeviceIndex(this.devices, deviceId)
        if (index < 0) return { success: false, message: '设备不存在。' }
        const device = this.devices[index]
        if (device.ownerUserId !== userId) {
          return { success: false, message: '只有所有者可以一键清空设备。' }
        }

        this.photos = this.photos.map((item) => ({
          ...item,
          deviceIds: item.deviceIds.filter((id) => id !== deviceId),
        }))
        device.storageUsedMb = 0
        device.lastSeenAt = dayjs().toISOString()
        return { success: true, message: '设备物理存储已清空，我的相册记录已保留。', deviceId }
      },
      connectDevice(deviceId: string): ScenarioActionResult {
        const { userId, userName } = getCurrentUserContext()
        if (!userId) return { success: false, message: '请先登录后再连接设备。' }
        const index = findDeviceIndex(this.devices, deviceId)
        if (index < 0) return { success: false, message: '设备不存在。' }
        const device = this.devices[index]
        const canUse = device.ownerUserId === userId || device.memberUserIds.includes(userId)
        if (!canUse && device.ownerUserId) {
          return { success: false, message: '请先绑定该设备后再连接。' }
        }
        if (!canUse && !device.ownerUserId) {
          device.ownerUserId = userId
          device.ownerName = userName
        }
        device.connectionState = 'connected'
        device.status = 'online'
        device.lastSeenAt = dayjs().toISOString()
        this.currentDeviceId = deviceId
        return { success: true, message: '设备已连接。', deviceId }
      },
      disconnectDevice(deviceId: string): ScenarioActionResult {
        const index = findDeviceIndex(this.devices, deviceId)
        if (index < 0) return { success: false, message: '设备不存在。' }
        this.devices[index].connectionState = 'disconnected'
        this.devices[index].lastSeenAt = dayjs().toISOString()
        return { success: true, message: '设备已断开连接。', deviceId }
      },
      async castDraftPhotosToDevice(deviceId: string, drafts: DraftPhotoInput[]): Promise<CastActionResult> {
        const { userId, userName } = getCurrentUserContext()
        if (!userId) {
          return { success: false, message: '请先完成微信手机号快捷登录。', successCount: 0, failedCount: 0, storageFull: false }
        }

        const index = findDeviceIndex(this.devices, deviceId)
        if (index < 0) {
          return { success: false, message: '请选择有效设备。', successCount: 0, failedCount: 0, storageFull: false }
        }

        if (!drafts.length) {
          return { success: false, message: '请先选择需要投屏的照片。', successCount: 0, failedCount: 0, storageFull: false }
        }

        const device = this.devices[index]
        const needStorageMb = drafts.reduce((sum, item) => sum + getPhotoSizeMb(item.sizeKb), 0)
        if (device.storageUsedMb + needStorageMb > device.storageTotalMb) {
          const now = dayjs().toISOString()
          drafts.forEach((item) => {
            this.castRecords.unshift({
              id: createScenarioId('cast'),
              photoId: null,
              photoName: item.name,
              photoPath: item.tempFilePath,
              deviceId: device.id,
              deviceName: device.name,
              status: 'failed',
              message: '设备内存已满，请先清理设备照片或联系设备所有者。',
              createdAt: now,
              uploadedByUserId: userId,
            })
          })
          return {
            success: false,
            message: '设备内存已满，请先清理设备照片或联系设备所有者。',
            successCount: 0,
            failedCount: drafts.length,
            storageFull: true,
          }
        }

        const createdAt = dayjs().toISOString()
        for (const item of drafts) {
          const savedPath = await saveLocalFileIfNeeded(item.tempFilePath)
          const photoId = createScenarioId('photo')
          this.photos.unshift({
            id: photoId,
            name: item.name,
            filePath: savedPath,
            thumbnailPath: savedPath,
            createdAt,
            uploadedByUserId: userId,
            uploadedByName: userName,
            source: item.source,
            sizeKb: item.sizeKb,
            width: item.width,
            height: item.height,
            deviceIds: [device.id],
          })
          this.castRecords.unshift({
            id: createScenarioId('cast'),
            photoId,
            photoName: item.name,
            photoPath: savedPath,
            deviceId: device.id,
            deviceName: device.name,
            status: 'success',
            message: '投屏成功',
            createdAt,
            uploadedByUserId: userId,
          })
          device.storageUsedMb += getPhotoSizeMb(item.sizeKb)
        }

        device.status = 'online'
        device.connectionState = 'connected'
        device.lastSeenAt = createdAt
        this.currentDeviceId = device.id
        return {
          success: true,
          message: `已投屏 ${drafts.length} 张照片`,
          successCount: drafts.length,
          failedCount: 0,
          storageFull: false,
        }
      },
      castSavedPhotosToDevice(deviceId: string, photoIds: string[]): CastActionResult {
        const { userId } = getCurrentUserContext()
        if (!userId) {
          return { success: false, message: '请先登录后再投屏。', successCount: 0, failedCount: 0, storageFull: false }
        }
        const index = findDeviceIndex(this.devices, deviceId)
        if (index < 0) {
          return { success: false, message: '设备不存在。', successCount: 0, failedCount: 0, storageFull: false }
        }

        const targetPhotos = this.photos.filter((item) => photoIds.includes(item.id) && item.uploadedByUserId === userId)
        if (!targetPhotos.length) {
          return { success: false, message: '未找到可投屏的照片。', successCount: 0, failedCount: 0, storageFull: false }
        }

        const device = this.devices[index]
        const newPhotos = targetPhotos.filter((item) => !item.deviceIds.includes(device.id))
        const needStorageMb = newPhotos.reduce((sum, item) => sum + getPhotoSizeMb(item.sizeKb), 0)
        if (device.storageUsedMb + needStorageMb > device.storageTotalMb) {
          const createdAt = dayjs().toISOString()
          newPhotos.forEach((item) => {
            this.castRecords.unshift({
              id: createScenarioId('cast'),
              photoId: item.id,
              photoName: item.name,
              photoPath: item.thumbnailPath,
              deviceId: device.id,
              deviceName: device.name,
              status: 'failed',
              message: '设备内存已满，请清理后重试。',
              createdAt,
              uploadedByUserId: userId,
            })
          })
          return {
            success: false,
            message: '设备内存不足，无法完成投屏。',
            successCount: 0,
            failedCount: newPhotos.length,
            storageFull: true,
          }
        }

        const createdAt = dayjs().toISOString()
        targetPhotos.forEach((item) => {
          const alreadyExists = item.deviceIds.includes(device.id)
          if (!alreadyExists) {
            item.deviceIds.push(device.id)
            device.storageUsedMb += getPhotoSizeMb(item.sizeKb)
          }
          this.castRecords.unshift({
            id: createScenarioId('cast'),
            photoId: item.id,
            photoName: item.name,
            photoPath: item.thumbnailPath,
            deviceId: device.id,
            deviceName: device.name,
            status: 'success',
            message: alreadyExists ? '照片已存在于设备中' : '投屏成功',
            createdAt,
            uploadedByUserId: userId,
          })
        })

        device.status = 'online'
        device.lastSeenAt = createdAt
        device.connectionState = 'connected'
        this.currentDeviceId = device.id
        return {
          success: true,
          message: `已处理 ${targetPhotos.length} 张照片`,
          successCount: targetPhotos.length,
          failedCount: 0,
          storageFull: false,
        }
      },
      async deletePhotos(photoIds: string[]) {
        const { userId } = getCurrentUserContext()
        if (!userId) return { success: false, message: '请先登录后再删除照片。' }

        const removable = this.photos.filter((item) => photoIds.includes(item.id) && item.uploadedByUserId === userId)
        if (!removable.length) {
          return { success: false, message: '没有可删除的照片。' }
        }

        removable.forEach((photo) => {
          photo.deviceIds.forEach((deviceId) => {
            const deviceIndex = findDeviceIndex(this.devices, deviceId)
            if (deviceIndex >= 0) {
              this.devices[deviceIndex].storageUsedMb = Math.max(
                0,
                this.devices[deviceIndex].storageUsedMb - getPhotoSizeMb(photo.sizeKb),
              )
            }
          })
        })

        this.photos = this.photos.filter((item) => !photoIds.includes(item.id) || item.uploadedByUserId !== userId)
        for (const item of removable) {
          await removeLocalFileIfNeeded(item.filePath)
        }
        return { success: true, message: `已删除 ${removable.length} 张照片。` }
      },
      removeCastRecord(recordId: string): ScenarioActionResult {
        const next = this.castRecords.filter((item) => item.id !== recordId)
        if (next.length === this.castRecords.length) {
          return { success: false, message: '记录不存在。' }
        }
        this.castRecords = next
        return { success: true, message: '投屏记录已删除。' }
      },
      addLocationTrack(deviceId: string, latitude: number, longitude: number, address: string) {
        const createdAt = dayjs().toISOString()
        this.locationTracks.unshift({
          id: createScenarioId('track'),
          deviceId,
          latitude,
          longitude,
          name: address || '最近定位',
          createdAt,
        })
        this.locationTracks = this.locationTracks
          .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
          .slice(0, 40)

        const index = findDeviceIndex(this.devices, deviceId)
        if (index >= 0) {
          this.devices[index].location = address || this.devices[index].location
          this.devices[index].lastSeenAt = createdAt
        }
      },
      toggleMessageNotifications(enabled: boolean) {
        this.settings.messageNotifications = enabled
      },
      resetForAccountDeletion() {
        const userStore = useUserStore()
        userStore.clearUserInfo()
        Object.assign(this, createDefaultState())
        this.bootstrap()
      },
      getPhotoById(photoId: string) {
        return this.photos.find((item) => item.id === photoId) || null
      },
      getDeviceById(deviceId: string) {
        return this.devices.find((item) => item.id === deviceId) || null
      },
      getTrackListByDevice(deviceId: string) {
        return this.locationTracks
          .filter((item) => item.deviceId === deviceId)
          .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
      },
      getDeviceSummary() {
        return this.devices.map((item) => ({
          ...item,
          lastSeenLabel: formatDateLabel(item.lastSeenAt),
        }))
      },
    },
    persist: true,
  },
)
