import type {
  AlbumPageData,
  BindDevicePageData,
  ComplaintPageData,
  ConnectionPageData,
  DashboardPageData,
  DeviceHubPageData,
  GuidePageData,
  LocationPageData,
  MyCenterPageData,
  PermissionPageData,
  ProfilePageData,
  RequestDraft,
  SearchDevicePageData,
  SettingsPageData,
  ThemePageData,
} from './types'

export * from './types'

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
  complaintCenter: '/pages/user/complaintCenter',
  guideCenter: '/pages/user/guideCenter',
  settingsCenter: '/pages/user/settingsCenter',
} as const

const clone = <T>(payload: T): T => JSON.parse(JSON.stringify(payload)) as T

const resolveMock = async <T>(payload: T): Promise<T> => clone(payload)

const baseRequestDrafts: RequestDraft[] = [
  {
    label: '首页概览',
    method: 'GET',
    path: '/api/v1/dashboard/overview',
    description: '聚合设备数量、在线率、投诉数量和最近活跃设备。',
  },
  {
    label: '我的中心',
    method: 'GET',
    path: '/api/v1/user/center',
    description: '返回头像、角色、菜单权限和个性化配置。',
  },
]

const dashboardData: DashboardPageData = {
  heroTitle: '设备管理业务静态壳',
  heroSubtitle: '已按需求清单收拢为首页、设备、我的三大入口，并预留接口替换点。',
  versionText: 'v0.1 static shell',
  summary: [
    { label: '设备总数', value: '32', hint: '含在线、离线、待激活' },
    { label: '在线设备', value: '26', hint: '在线率 81%' },
    { label: '我的相册', value: '128', hint: '近 7 天新增 18 张' },
    { label: '待处理投诉', value: '4', hint: '2 条今日新增' },
  ],
  capabilities: [
    {
      title: '相册能力',
      subtitle: '调相机、相册、图片裁剪与上传。',
      badge: 'APP',
      url: SCENARIO_ROUTES.albumCenter,
    },
    {
      title: '权限说明',
      subtitle: '对照 iOS、Android、小程序权限清单。',
      badge: '多端',
      url: SCENARIO_ROUTES.devicePermissions,
    },
    {
      title: '绑定设备',
      subtitle: '扫码、蓝牙搜索、SN 校验的静态流程。',
      badge: '新增',
      url: SCENARIO_ROUTES.bindDevice,
    },
    {
      title: '设备搜索',
      subtitle: '预置搜索过滤项和搜索结果样式。',
      badge: '静态',
      url: SCENARIO_ROUTES.searchDevice,
    },
  ],
  devices: [
    {
      id: 'dev-001',
      name: '前门主控盒',
      serialNumber: 'SN-A10234',
      status: '在线',
      location: '杭州园区 A 栋',
      battery: '76%',
      signal: '蓝牙强',
      lastSeen: '刚刚',
      tags: ['主设备', '已绑定'],
    },
    {
      id: 'dev-002',
      name: '仓库边缘摄像头',
      serialNumber: 'SN-B77891',
      status: '待激活',
      location: '仓储区 2 号门',
      battery: '100%',
      signal: '待连接',
      lastSeen: '未激活',
      tags: ['新设备', '待确认'],
    },
    {
      id: 'dev-003',
      name: '巡检中继器',
      serialNumber: 'SN-C53128',
      status: '离线',
      location: '巡检通道西侧',
      battery: '14%',
      signal: '弱',
      lastSeen: '30 分钟前',
      tags: ['低电量'],
    },
  ],
  requestDrafts: [
    ...baseRequestDrafts,
    {
      label: '最近设备',
      method: 'GET',
      path: '/api/v1/device/recent',
      description: '首页下半部分的设备卡片列表，支持分页或最近 N 条。',
    },
  ],
}

const deviceHubData: DeviceHubPageData = {
  summary: [
    { label: '已绑定', value: '18', hint: '用户名下设备' },
    { label: '待巡检', value: '6', hint: '超过 24h 未回传' },
    { label: '待激活', value: '3', hint: '完成绑定未连接' },
    { label: '告警中', value: '2', hint: '网络或电量异常' },
  ],
  shortcuts: [
    { title: '绑定设备', subtitle: '新设备录入', badge: '入口', url: SCENARIO_ROUTES.bindDevice },
    { title: '设备搜索', subtitle: '名称 / SN / 标签', badge: '筛选', url: SCENARIO_ROUTES.searchDevice },
    { title: '设备连接', subtitle: '连接状态与步骤', badge: '蓝牙', url: SCENARIO_ROUTES.deviceConnect },
  ],
  devices: dashboardData.devices,
  timeline: [
    { time: '09:30', title: '前门主控盒回传状态', description: '温度、信号、电量均正常。' },
    { time: '10:15', title: '仓库边缘摄像头等待激活', description: '已发现蓝牙广播，待用户确认绑定。' },
    { time: '11:05', title: '巡检中继器离线告警', description: '建议检查供电和中继链路。' },
  ],
  requestDrafts: [
    {
      label: '设备中心统计',
      method: 'GET',
      path: '/api/v1/device/hub',
      description: '返回统计卡、快捷入口配置和默认设备列表。',
    },
    {
      label: '设备状态流',
      method: 'GET',
      path: '/api/v1/device/timeline',
      description: '供“最新动态”时间线使用，可按用户或设备组过滤。',
    },
  ],
}

const myCenterData: MyCenterPageData = {
  profile: {
    name: '王晓云',
    role: '设备管理员',
    company: '示例智能科技',
    slogan: '当前版本为静态业务壳，菜单与接口已按需求清单整理。',
  },
  menuGroups: [
    {
      title: '设备相关',
      items: [
        { title: '设备连接', subtitle: '蓝牙、网络与状态校验', badge: '设备', url: SCENARIO_ROUTES.deviceConnect },
        { title: '设备定位-小程序', subtitle: '位置采集与轨迹展示', badge: '小程序', url: SCENARIO_ROUTES.miniLocation },
        { title: '我的设备', subtitle: '切到设备中心查看设备', badge: 'Tab', url: SCENARIO_ROUTES.deviceHub, isTab: true },
      ],
    },
    {
      title: '个人中心',
      items: [
        { title: '自定义主题-app', subtitle: '主题色、按钮、卡片风格', badge: 'APP', url: SCENARIO_ROUTES.themeCenter },
        { title: '个人信息', subtitle: '姓名、手机号、身份与角色', badge: '资料', url: SCENARIO_ROUTES.profileInfo },
        { title: '我的相册', subtitle: '素材目录、最近上传和封面样式', badge: '图片', url: SCENARIO_ROUTES.albumCenter },
      ],
    },
    {
      title: '服务支持',
      items: [
        { title: '投诉管理', subtitle: '问题提单、状态跟踪和处理记录', badge: '工单', url: SCENARIO_ROUTES.complaintCenter },
        { title: '资料指南', subtitle: '文档、FAQ 和操作说明', badge: '文档', url: SCENARIO_ROUTES.guideCenter },
        { title: '设置', subtitle: '通知、缓存、隐私和版本信息', badge: '系统', url: SCENARIO_ROUTES.settingsCenter },
      ],
    },
  ],
  requestDrafts: [
    ...baseRequestDrafts,
    {
      label: '用户菜单权限',
      method: 'GET',
      path: '/api/v1/user/menu-permissions',
      description: '如果后续需要菜单权限控制，可在这里接入后端返回项。',
    },
  ],
}

const permissionPageData: PermissionPageData = {
  intro: '对照需求清单，首页需要承接相册、蓝牙、定位、相机等多端权限能力，这里只做静态说明和后续接口占位。',
  permissions: [
    { platform: 'APP iOS', title: '相册/拍照', description: '调用系统相册和相机，处理图片裁剪、压缩与上传。', required: true },
    { platform: 'APP Android', title: '相册/拍照', description: '兼容相册读取、拍照回调与权限二次确认。', required: true },
    { platform: '小程序', title: '位置权限', description: '设备定位、小程序地图页与地理围栏提示。', required: true },
    { platform: '小程序', title: '蓝牙权限', description: '绑定设备和搜索设备时发现周边蓝牙设备。', required: true },
    { platform: '小程序', title: '相机权限', description: '扫码绑定或现场拍摄附件时使用。', required: false },
  ],
  requestDrafts: [
    {
      label: '权限清单',
      method: 'GET',
      path: '/api/v1/system/permissions',
      description: '返回不同终端需要展示的权限说明、文案和版本开关。',
    },
  ],
}

const bindDevicePageData: BindDevicePageData = {
  steps: [
    { title: '扫描或搜索设备', description: '支持扫码录入，也支持蓝牙发现后选择设备。', status: 'done' },
    { title: '校验设备信息', description: '比对 SN、MAC、设备型号与归属租户。', status: 'active' },
    { title: '确认绑定结果', description: '绑定成功后刷新设备中心与首页统计。', status: 'pending' },
  ],
  formDraft: [
    { label: '设备编号', value: 'SN-A10234', description: '扫码或手动录入均可。' },
    { label: '设备名称', value: '前门主控盒', description: '允许用户自定义别名。' },
    { label: '安装位置', value: '杭州园区 A 栋', description: '后续可以接地图定位或部门树。' },
    { label: '归属备注', value: '门禁系统一期', description: '为后续搜索、投诉和资料关联预留。' },
  ],
  requestDrafts: [
    {
      label: '搜索附近设备',
      method: 'GET',
      path: '/api/v1/device/discovery',
      description: '搜索蓝牙广播设备或二维码解析后的设备信息。',
    },
    {
      label: '提交绑定',
      method: 'POST',
      path: '/api/v1/device/bind',
      description: '提交设备编号、名称、安装位置和附加备注。',
    },
  ],
}

const searchDevicePageData: SearchDevicePageData = {
  filters: [
    { label: '搜索关键字', value: '设备名称 / SN / 标签', description: '支持模糊搜索。' },
    { label: '设备状态', value: '全部 / 在线 / 离线 / 待激活', description: '后续可改成字典项。' },
    { label: '所属位置', value: '园区 / 楼栋 / 楼层', description: '可接联动选择器。' },
  ],
  results: dashboardData.devices,
  requestDrafts: [
    {
      label: '设备搜索',
      method: 'GET',
      path: '/api/v1/device/search',
      description: '支持分页、状态过滤、关键字与标签搜索。',
    },
  ],
}

const connectionPageData: ConnectionPageData = {
  summary: [
    { label: '蓝牙已连接', value: '12', hint: '当前会话设备数' },
    { label: '待重试', value: '2', hint: '信号弱或权限不足' },
    { label: '最近成功', value: '11:18', hint: '前门主控盒' },
  ],
  steps: [
    { title: '检查终端权限', description: '确认蓝牙、位置和系统授权已打开。', status: 'done' },
    { title: '发现并发起连接', description: '展示附近设备、RSSI 和可连接状态。', status: 'active' },
    { title: '回传连接结果', description: '记录连接状态并同步到设备中心。', status: 'pending' },
  ],
  requestDrafts: [
    {
      label: '设备连接状态',
      method: 'GET',
      path: '/api/v1/device/connection/status',
      description: '查询当前用户与设备之间的连接状态和异常原因。',
    },
    {
      label: '记录连接结果',
      method: 'POST',
      path: '/api/v1/device/connection/report',
      description: '写入连接成功、失败、超时等状态日志。',
    },
  ],
}

const locationPageData: LocationPageData = {
  summary: [
    { label: '当前设备', value: '前门主控盒', hint: '小程序设备定位示例' },
    { label: '最后上报', value: '11:23', hint: '坐标已脱敏展示' },
    { label: '轨迹点位', value: '8', hint: '今日累计' },
  ],
  timeline: [
    { time: '08:30', title: '园区北门', description: '开始作业，首次定位成功。' },
    { time: '09:50', title: 'A 栋 1 楼', description: '设备信号稳定，蓝牙交互正常。' },
    { time: '11:23', title: 'A 栋 前台', description: '最后一条定位记录。' },
  ],
  requestDrafts: [
    {
      label: '获取定位轨迹',
      method: 'GET',
      path: '/api/v1/device/location/tracks',
      description: '支持按设备、日期范围返回轨迹点和最后位置。',
    },
  ],
}

const themePageData: ThemePageData = {
  activeTheme: '海盐蓝',
  palettes: [
    { title: '海盐蓝', colors: ['#1f6fff', '#4b88ff', '#dbe7ff'], description: '适合设备状态和数据概览。' },
    { title: '松针绿', colors: ['#18794e', '#3ba776', '#dff6ea'], description: '适合设备连接成功和健康态。' },
    { title: '砂岩橙', colors: ['#d97706', '#f59e0b', '#fff2d6'], description: '适合告警与待处理事项。' },
  ],
  requestDrafts: [
    {
      label: '获取主题配置',
      method: 'GET',
      path: '/api/v1/user/theme',
      description: '返回当前主题、可选主题以及自定义变量。',
    },
    {
      label: '保存主题',
      method: 'PUT',
      path: '/api/v1/user/theme',
      description: '提交主题方案和个性化颜色变量。',
    },
  ],
}

const profilePageData: ProfilePageData = {
  fields: [
    { label: '姓名', value: '王晓云', description: '展示用户实名信息。' },
    { label: '手机号', value: '138-0000-1234', description: '后续可接短信验证。' },
    { label: '所属角色', value: '设备管理员', description: '决定可见菜单与按钮。' },
    { label: '所属部门', value: '运维中心', description: '预留组织树选择。' },
  ],
  requestDrafts: [
    {
      label: '获取个人信息',
      method: 'GET',
      path: '/api/v1/user/profile',
      description: '返回用户基础信息、角色和部门资料。',
    },
    {
      label: '保存个人信息',
      method: 'PUT',
      path: '/api/v1/user/profile',
      description: '保存手机号、昵称、部门和头像等字段。',
    },
  ],
}

const albumPageData: AlbumPageData = {
  albums: [
    { title: '巡检记录', coverLabel: 'JG', count: '68 张', updatedAt: '今天 10:20' },
    { title: '安装归档', coverLabel: 'AZ', count: '31 张', updatedAt: '昨天 17:40' },
    { title: '投诉附件', coverLabel: 'TS', count: '29 张', updatedAt: '04-18 09:12' },
  ],
  requestDrafts: [
    {
      label: '相册目录',
      method: 'GET',
      path: '/api/v1/albums',
      description: '返回相册分组、封面、照片总数和最近更新时间。',
    },
    {
      label: '上传照片',
      method: 'POST',
      path: '/api/v1/albums/upload',
      description: '后续可接 uni.uploadFile 或云存储签名上传。',
    },
  ],
}

const complaintPageData: ComplaintPageData = {
  channels: [
    { label: '微信投诉', value: '2', hint: '待回复' },
    { label: 'APP 反馈', value: '1', hint: '处理中' },
    { label: '电话转单', value: '1', hint: '待回访' },
  ],
  tickets: [
    { id: 'TS-20260420-01', title: '设备搜索结果为空', status: '处理中', owner: '产品经理', updatedAt: '11:12' },
    { id: 'TS-20260419-05', title: '绑定后首页统计未刷新', status: '待确认', owner: '开发', updatedAt: '昨天 18:40' },
    { id: 'TS-20260418-02', title: '小程序定位偶发延迟', status: '已受理', owner: '测试', updatedAt: '04-18 16:22' },
  ],
  requestDrafts: [
    {
      label: '投诉列表',
      method: 'GET',
      path: '/api/v1/complaints',
      description: '查询投诉渠道、状态、负责人和更新时间。',
    },
    {
      label: '新增投诉',
      method: 'POST',
      path: '/api/v1/complaints',
      description: '提交标题、描述、联系方式和附件列表。',
    },
  ],
}

const guidePageData: GuidePageData = {
  docs: [
    { title: '绑定设备操作指南', category: '快速开始', summary: '讲解扫码、蓝牙发现、绑定确认和常见失败原因。' },
    { title: '小程序定位说明', category: '平台说明', summary: '列出定位权限、地图展示和常见兼容问题。' },
    { title: '投诉处理流程', category: '服务支持', summary: '规范提单、处理、回访与关闭节点。' },
  ],
  requestDrafts: [
    {
      label: '资料中心',
      method: 'GET',
      path: '/api/v1/guides',
      description: '返回文档列表、分类、摘要和跳转链接。',
    },
  ],
}

const settingsPageData: SettingsPageData = {
  settings: [
    { title: '消息通知', value: '开启', description: '设备异常、投诉状态和系统公告提醒。' },
    { title: '隐私说明', value: '查看', description: '定位、相册、蓝牙等数据采集说明。' },
    { title: '缓存清理', value: '128 MB', description: '后续可接清理缓存和临时文件逻辑。' },
    { title: '当前版本', value: '0.1.0-static', description: '静态壳版本标识，便于后续联调。' },
  ],
  requestDrafts: [
    {
      label: '设置项',
      method: 'GET',
      path: '/api/v1/settings',
      description: '获取通知、缓存、隐私、版本等设置项。',
    },
    {
      label: '保存设置',
      method: 'PUT',
      path: '/api/v1/settings',
      description: '提交开关项与本地偏好设置。',
    },
  ],
}

export async function getDashboardPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/dashboard/overview')
  return resolveMock(dashboardData)
}

export async function getDeviceHubPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/device/hub')
  return resolveMock(deviceHubData)
}

export async function getMyCenterPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/user/center')
  return resolveMock(myCenterData)
}

export async function getPermissionPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/system/permissions')
  return resolveMock(permissionPageData)
}

export async function getBindDevicePageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/device/bind/form-draft')
  return resolveMock(bindDevicePageData)
}

export async function getSearchDevicePageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/device/search')
  return resolveMock(searchDevicePageData)
}

export async function getConnectionPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/device/connection/status')
  return resolveMock(connectionPageData)
}

export async function getLocationPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/device/location/tracks')
  return resolveMock(locationPageData)
}

export async function getThemePageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/user/theme')
  return resolveMock(themePageData)
}

export async function getProfilePageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/user/profile')
  return resolveMock(profilePageData)
}

export async function getAlbumPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/albums')
  return resolveMock(albumPageData)
}

export async function getComplaintPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/complaints')
  return resolveMock(complaintPageData)
}

export async function getGuidePageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/guides')
  return resolveMock(guidePageData)
}

export async function getSettingsPageData() {
  // TODO: 接真实接口时替换为 http.get('/api/v1/settings')
  return resolveMock(settingsPageData)
}

export async function submitBindDevice(payload: Record<string, unknown>) {
  // TODO: 接真实接口时替换为 http.post('/api/v1/device/bind', payload)
  return resolveMock({
    success: true,
    payload,
    message: '绑定设备伪请求已预留。',
  })
}

export async function submitComplaint(payload: Record<string, unknown>) {
  // TODO: 接真实接口时替换为 http.post('/api/v1/complaints', payload)
  return resolveMock({
    success: true,
    payload,
    message: '投诉提单伪请求已预留。',
  })
}

export async function saveThemeSelection(payload: Record<string, unknown>) {
  // TODO: 接真实接口时替换为 http.put('/api/v1/user/theme', payload)
  return resolveMock({
    success: true,
    payload,
    message: '主题保存伪请求已预留。',
  })
}

export async function saveSettings(payload: Record<string, unknown>) {
  // TODO: 接真实接口时替换为 http.put('/api/v1/settings', payload)
  return resolveMock({
    success: true,
    payload,
    message: '设置保存伪请求已预留。',
  })
}
