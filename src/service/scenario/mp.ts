import { isMpWeixin } from '@/utils/platform'
import { createScenarioId } from './index'
import type { BluetoothScanResult, DraftPhotoInput, MediaSource, ScenarioLocationSnapshot } from './types'

function getFileName(filePath: string, fallbackPrefix: string) {
  const segments = filePath.split('/')
  const last = segments[segments.length - 1]
  if (last) return last
  return `${fallbackPrefix}-${Date.now()}.jpg`
}

function withTimeout<T>(promiseFactory: () => Promise<T>, fallback: T, timeoutMs = 3000) {
  return Promise.race([
    promiseFactory(),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), timeoutMs)
    }),
  ])
}

export function saveLocalFileIfNeeded(filePath: string) {
  if (!filePath || filePath.startsWith('/static/')) {
    return Promise.resolve(filePath)
  }

  return new Promise<string>((resolve) => {
    if (!filePath.startsWith('wxfile:') && !filePath.startsWith('http') && !filePath.startsWith('file:')) {
      resolve(filePath)
      return
    }

    uni.saveFile({
      tempFilePath: filePath,
      success: (res) => resolve(res.savedFilePath || filePath),
      fail: () => resolve(filePath),
    })
  })
}

export function removeLocalFileIfNeeded(filePath: string) {
  if (!filePath || filePath.startsWith('/static/')) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    uni.removeSavedFile({
      filePath,
      complete: () => resolve(),
    })
  })
}

export function pickScenarioImages(source: MediaSource, count = 1) {
  return new Promise<DraftPhotoInput[]>((resolve, reject) => {
    uni.chooseMedia({
      count,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: [source],
      success: (res) => {
        const files = (res.tempFiles || []).map((item, index) => ({
          id: createScenarioId(`draft-${index}`),
          name: item.name || getFileName(item.tempFilePath, source),
          tempFilePath: item.tempFilePath,
          sizeKb: Math.max(1, Math.round((item.size || 0) / 1024)),
          width: item.width || 0,
          height: item.height || 0,
          source,
        }))
        resolve(files)
      },
      fail: (error) => reject(error),
    })
  })
}

export function scanScenarioCode() {
  return new Promise<string>((resolve, reject) => {
    uni.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => resolve(res.result),
      fail: (error) => reject(error),
    })
  })
}

export function requestScenarioLocation() {
  return new Promise<ScenarioLocationSnapshot>((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address || res.errMsg || '当前位置',
        })
      },
      fail: (error) => reject(error),
    })
  })
}

async function scanBluetoothDevicesInternal(timeoutMs: number) {
  if (!isMpWeixin) return []

  const openAdapter = () =>
    new Promise<void>((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: () => resolve(),
        fail: (error) => reject(error),
      })
    })

  const startDiscovery = () =>
    new Promise<void>((resolve, reject) => {
      uni.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
        success: () => resolve(),
        fail: (error) => reject(error),
      })
    })

  const getDevices = () =>
    new Promise<BluetoothScanResult[]>((resolve) => {
      uni.getBluetoothDevices({
        success: (res) => {
          resolve(
            (res.devices || [])
              .filter((item) => item.name || item.localName || item.deviceId)
              .map((item, index) => ({
                id: item.deviceId || createScenarioId(`bt-${index}`),
                name: item.name || item.localName || `蓝牙设备 ${index + 1}`,
                serialNumber: `SN-${(item.deviceId || '').slice(-6).toUpperCase() || `BT${index + 1}`}`,
                signalLevel: item.RSSI ? Math.min(4, Math.max(1, Math.ceil((item.RSSI + 100) / 15))) : 2,
                type: '蓝牙设备',
                location: '附近可发现设备',
              })),
          )
        },
        fail: () => resolve([]),
      })
    })

  const stopDiscovery = () =>
    new Promise<void>((resolve) => {
      uni.stopBluetoothDevicesDiscovery({
        complete: () => resolve(),
      })
    })

  const closeAdapter = () =>
    new Promise<void>((resolve) => {
      uni.closeBluetoothAdapter({
        complete: () => resolve(),
      })
    })

  try {
    await openAdapter()
    await startDiscovery()
    await new Promise((resolve) => setTimeout(resolve, timeoutMs))
    const devices = await getDevices()
    await stopDiscovery()
    await closeAdapter()
    return devices
  } catch {
    await closeAdapter()
    return []
  }
}

export function scanScenarioBluetoothDevices(timeoutMs = 2500) {
  return withTimeout(() => scanBluetoothDevicesInternal(timeoutMs), [], timeoutMs + 1000)
}

export function readMiniProgramAuthSetting() {
  return new Promise<UniApp.GetSettingSuccess>((resolve) => {
    uni.getSetting({
      success: (res) => resolve(res),
      fail: () => resolve({ authSetting: {} }),
    })
  })
}
