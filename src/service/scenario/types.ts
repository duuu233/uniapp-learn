export type DeviceStatus = 'online' | 'offline' | 'pending'
export type DeviceRole = 'owner' | 'user' | 'unbound'
export type CastStatus = 'success' | 'failed'
export type PermissionState = 'granted' | 'pending' | 'denied' | 'unsupported'
export type MediaSource = 'camera' | 'album'

export interface ScenarioDevice {
  id: string
  serialNumber: string
  name: string
  type: string
  location: string
  note: string
  status: DeviceStatus
  batteryLevel: number
  signalLevel: number
  lastSeenAt: string
  ownerUserId: string | null
  ownerName: string
  memberUserIds: string[]
  storageTotalMb: number
  storageUsedMb: number
  slideshowEnabled: boolean
  connectionState: 'connected' | 'disconnected'
}

export interface ScenarioPhoto {
  id: string
  name: string
  filePath: string
  thumbnailPath: string
  createdAt: string
  uploadedByUserId: string
  uploadedByName: string
  source: MediaSource
  sizeKb: number
  width: number
  height: number
  deviceIds: string[]
  isLocalAsset?: boolean
}

export interface ScenarioCastRecord {
  id: string
  photoId: string | null
  photoName: string
  photoPath: string
  deviceId: string
  deviceName: string
  status: CastStatus
  message: string
  createdAt: string
  uploadedByUserId: string
}

export interface ScenarioGuideDoc {
  id: string
  deviceType: string
  title: string
  summary: string
  bullets: string[]
}

export interface ScenarioLocationTrack {
  id: string
  deviceId: string
  latitude: number
  longitude: number
  name: string
  createdAt: string
}

export interface ScenarioSettings {
  messageNotifications: boolean
  companyName: string
  contactPhone: string
  contactWechat: string
  aboutText: string
  privacyPolicy: string
  userAgreement: string
}

export interface ScenarioAppState {
  initialized: boolean
  currentDeviceId: string
  devices: ScenarioDevice[]
  photos: ScenarioPhoto[]
  castRecords: ScenarioCastRecord[]
  guides: ScenarioGuideDoc[]
  settings: ScenarioSettings
  locationTracks: ScenarioLocationTrack[]
}

export interface DraftPhotoInput {
  id: string
  name: string
  tempFilePath: string
  sizeKb: number
  width: number
  height: number
  source: MediaSource
}

export interface ScenarioActionResult {
  success: boolean
  message: string
  deviceId?: string
}

export interface CastActionResult {
  success: boolean
  message: string
  successCount: number
  failedCount: number
  storageFull: boolean
}

export interface BindDevicePayload {
  serialNumber: string
  name: string
  location: string
  note: string
}

export interface BluetoothScanResult {
  id: string
  name: string
  serialNumber: string
  signalLevel: number
  type: string
  location: string
}

export interface ScenarioLocationSnapshot {
  latitude: number
  longitude: number
  address: string
}
