export interface RequestDraft {
  label: string
  method: 'GET' | 'POST' | 'PUT'
  path: string
  description: string
}

export interface SummaryCard {
  label: string
  value: string
  hint: string
}

export interface RouteAction {
  title: string
  subtitle: string
  badge: string
  url: string
  isTab?: boolean
}

export interface DeviceItem {
  id: string
  name: string
  serialNumber: string
  status: '在线' | '离线' | '待激活'
  location: string
  battery: string
  signal: string
  lastSeen: string
  tags: string[]
}

export interface PermissionItem {
  platform: string
  title: string
  description: string
  required: boolean
}

export interface StepItem {
  title: string
  description: string
  status: 'done' | 'active' | 'pending'
}

export interface KeyValueItem {
  label: string
  value: string
  description?: string
}

export interface AlbumItem {
  title: string
  coverLabel: string
  count: string
  updatedAt: string
}

export interface TicketItem {
  id: string
  title: string
  status: string
  owner: string
  updatedAt: string
}

export interface DocItem {
  title: string
  category: string
  summary: string
}

export interface SettingItem {
  title: string
  value: string
  description: string
}

export interface TimelineItem {
  time: string
  title: string
  description: string
}

export interface DashboardPageData {
  heroTitle: string
  heroSubtitle: string
  versionText: string
  summary: SummaryCard[]
  capabilities: RouteAction[]
  devices: DeviceItem[]
  requestDrafts: RequestDraft[]
}

export interface DeviceHubPageData {
  summary: SummaryCard[]
  shortcuts: RouteAction[]
  devices: DeviceItem[]
  timeline: TimelineItem[]
  requestDrafts: RequestDraft[]
}

export interface MyCenterPageData {
  profile: {
    name: string
    role: string
    company: string
    slogan: string
  }
  menuGroups: {
    title: string
    items: RouteAction[]
  }[]
  requestDrafts: RequestDraft[]
}

export interface PermissionPageData {
  intro: string
  permissions: PermissionItem[]
  requestDrafts: RequestDraft[]
}

export interface BindDevicePageData {
  steps: StepItem[]
  formDraft: KeyValueItem[]
  requestDrafts: RequestDraft[]
}

export interface SearchDevicePageData {
  filters: KeyValueItem[]
  results: DeviceItem[]
  requestDrafts: RequestDraft[]
}

export interface ConnectionPageData {
  summary: SummaryCard[]
  steps: StepItem[]
  requestDrafts: RequestDraft[]
}

export interface LocationPageData {
  summary: SummaryCard[]
  timeline: TimelineItem[]
  requestDrafts: RequestDraft[]
}

export interface ThemePageData {
  activeTheme: string
  palettes: {
    title: string
    colors: string[]
    description: string
  }[]
  requestDrafts: RequestDraft[]
}

export interface ProfilePageData {
  fields: KeyValueItem[]
  requestDrafts: RequestDraft[]
}

export interface AlbumPageData {
  albums: AlbumItem[]
  requestDrafts: RequestDraft[]
}

export interface ComplaintPageData {
  channels: SummaryCard[]
  tickets: TicketItem[]
  requestDrafts: RequestDraft[]
}

export interface GuidePageData {
  docs: DocItem[]
  requestDrafts: RequestDraft[]
}

export interface SettingsPageData {
  settings: SettingItem[]
  requestDrafts: RequestDraft[]
}
