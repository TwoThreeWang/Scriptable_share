// 宽组件显示电量和健康日历
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;

// 行间距
const LINE_HEIGHT = 5


const widget = new ListWidget()

// 组件内容配置
const widgetOptions = [
  {
    content: getDateInfo(),
    fontSize: 26,
    opacity: 0.8
  },
  {
    content: 'Enjoy the rest of your day.',
    fontColor: '#e6e6e6',
    regular: true,
    opacity: 0.7,
    fontSize: 13
  },
  {
    content: getYearProgress(),
    fontFamily: 'Menlo',
    fontColor: '#6886c5',
    regular: true,
    fontSize: 12,
  },
  {
    content: getBatteryInfo(),
    fontFamily: 'Menlo',
    fontColor: '#c4fb6d',
    regular: true,
    fontSize: 12,
  },
  {
    content: getWorkText(),
    fontSize: 16,
    opacity: 0.7
  },
  {
    content: await getDxyHealthCalendar(),
    fontSize: 16,
    opacity: 0.7
  }
]

// 渲染组件内容
renderWidget(widgetOptions)
await setWidgetBackground()
// 小组件初始化
Script.setWidget(widget)
Script.complete()


/**
 * 渲染方法
 * @param {*} options 
 * @param options.content 文本内容
 * @param options.fontFamily 文本字体
 * @param options.fontSize 文本大小
 * @param options.fontColor 文本颜色
 * @param options.regular 是否使用细字体
 * @param options.opacity 不透明度
 */
function renderWidget(options = []) {
  options.forEach(option => {
    const {content = '', fontFamily = '', fontSize = 14, fontColor = '#ffffff', regular = false, opacity = 1} = option
    const curText = widget.addText(content)
    curText.font = fontFamily ? 
      new Font(fontFamily, fontSize) : 
      Font[regular ? 'regularSystemFont' : 'boldSystemFont'](fontSize)
    curText.textOpacity = (opacity)
    curText.textColor = new Color(fontColor)
    widget.addSpacer(LINE_HEIGHT)
  })
}

/**
 * 设置背景图片
 */
async function setWidgetBackground() {
  // const url = "https://area.sinaapp.com/bingImg/"  // bing 壁纸
  const url = "https://unsplash.it/1600/900?random"  // 随机图片
  const i = await new Request(url);
  const img = await i.loadImage();
  widget.backgroundImage = img
}

/**
 * 获取电池信息
 */
function getBatteryInfo() {
  let batteryText = '电力 '
  // 是否在充电
  const isCharging = Device.isCharging()
  // 充电等级
  const batteryLevel = Math.round(Device.batteryLevel() * 100)
  
  // 显示电量进度
  const juice = "▓".repeat(Math.floor(batteryLevel / 10)); 
  const used = "░".repeat(10 - juice.length);
  batteryText += `${juice}${used} `

  // 显示电量值
  batteryText += `${batteryLevel}% `
  
  // 电量状态提示语枚举
  const batteryTextMap = {
    '0~10': "电量将耗尽,再不充电我就关机了!", //当电量少于10%
    '10~20': "电量就剩不到20%了,尽快充电!", //当电量在10-20%
    '20~30': "电量就快用完,赶紧充电!", //当电量在20-30%
    '30~40': "电量用了大半了,尽快充电啦!", //当电量在30-40%
    '40~50': "电量用了一半,有时间就充电啦!", //当电量在40-50%
    '50~70': "电量还有大半呢,不用着急充电!", //当电量在50-70%
    '70~80': "电量充足,不出远门没有问题!", //当电量在70-80%
    '80~100': "电量充足,很有安全感!!!" //当电量在80-100%
  }
  if (isCharging) {
    batteryText += batteryLevel < 100 ? "正在充电中⚡️⚡️⚡️" : "已充满电!请拔下电源!⚡️"
  } else {
    batteryText += utilIsInArea(batteryTextMap, batteryLevel)
  }

  return batteryText
}

/**
 * 获取今年的进度
 */
function getYearProgress() {
  let yearText = '全年 '

  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const end = new Date(now.getFullYear() + 1, 0, 1)
  const yearPassed = (now - start)
  const yearALL = (end - start)
  const yearPercent = Math.round(yearPassed / yearALL * 100)

  // 显示进度
  const passed = '▓'.repeat(Math.floor(yearPercent / 10));
  const left = '░'.repeat(10 - passed.length);
  yearText += `${passed}${left} `

  // 年进度信息
  yearText += `${yearPercent}% `

  // 年进度标语
  yearText += '今天过的咋样？'
  return yearText
}

/**
 * 获取日期信息
 */
function getDateInfo() {
  let dateText = ''
  const now = new Date();
  const weekday = now.getDay()
  const weekdayMap = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];

  dateText += `${now.getMonth() + 1}月`
  dateText += `${now.getDate()}日 · `
  dateText += `${weekdayMap[weekday]}`

  return dateText
}

/**
 * 获取工作日信息
 */
function getWorkText() {
  let dateText = '搬砖提醒：'
  const now = new Date();
  const weekday = now.getDay()

  if (weekday === 0) {
    dateText += `🙈 明天要上班凹～`
  } else if (weekday < 5) {
    dateText += `💼 离休息还有 ${5 - weekday} 天!`
  } else if (weekday === 5) {
    dateText += `🎉 周五! 你懂的!`
  } else {
    dateText += `💃 及时行乐～`
  }

  return dateText
}

/**
 * 获取丁香医生健康日历
 */
async function getDxyHealthCalendar() {
  const url = 'https://dxy.com/app/i/ask/discover/todayfeed/healthcalendar'
  const {data} = await fetchApi(url)
  return '健康日历：' + (data && data.items && data.items[0].title || '暂时获取不到数据~')
}

/**
 * 判断是否在区域里
 * @param {*} area 
 * @param {*} value 
 */
function utilIsInArea(area, value) {
  const matched = Object.keys(area).find(key => {
    const [strat, end] = key.split('~')
    return value > strat && value <= end
  })
  return area[matched]
}

/**
 * 获取接口数据
 * @param {*} url 
 */
async function fetchApi(url) {
  try {
    const api = new Request(url);
    return await api.loadJSON();
  } catch(err) {
    return {}
  }
}
