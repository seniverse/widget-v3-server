
import dateUtils from '../date'
import logger from '../logger'
import TpError from '../error'
import * as ALARM from '../constant/alarm'
import { formatLocal } from '../constant/language'
import { TEMPLATE_DATA } from '../constant/data'

export function returnEverything(data: any): any {
  return data
}

export const dataExtract = (target: any, dataChain: string[]) => {
  logger.debug(`[dataExtract] ${dataChain}`)
  let data = target
  const queue = [...dataChain]

  while (queue.length && data) {
    const key = queue.shift()
    logger.debug(`[dataExtract] ${key} - ${JSON.stringify(data)}`)

    const indexMatch = /\[(\d+)\]/.exec(key)
    if (indexMatch && indexMatch[1]) {
      data = data[key.replace(indexMatch[0], '')][parseInt(indexMatch[1], 10)]
    } else {
      data = data[key]
    }
  }

  if (data === undefined) {
    throw new TpError.WidgetError(`invalidate dataExtract: ${JSON.stringify(dataChain)} - ${JSON.stringify(target)}`)
  }
  return data || 'N/A'
}

export const calendar = (date: string, extra: { language: string }): string =>
  dateUtils.calendar(date, extra.language)

export const dateFormatter = (date: string): string => dateUtils.format(date, 'MM/DD')

export const formatAirQuality = (quality: string, extra: { language: string }): string => {
  if (quality.length >= 4) return quality
  return `${formatLocal(extra.language, 'air')}${quality}`
}

export const formatUpdateTime = (datetime: string, extra: { language: string }): string => {
  const template = formatLocal(extra.language, 'updateTime')
  return template.replace(`{time}`, dateUtils.format(datetime, 'HH:mm'))
}

export const weatherAlarmFormatter = (alarms: {
  title: string
  status: string
  type: string
  level: string
  pub_date: string
}[]) => ({
  alarms: alarms.map((alarm) => {
    const { status, pub_date: pubDate, ...others } = alarm
    return {
      ...others,
      pubDate,
      levelCode: ALARM.COLOR_MAPPING[alarm.level] || ALARM.COLOR_MAPPING['未知'],
      typeCode: ALARM.ALARM_MAPPING[alarm.type] || ALARM.ALARM_MAPPING['雷电']
    }
  })
})

export const weatherHourlyFormatterForChart = (data: {
  time: string
  code: string
  text: string
  temperature: string
}[]) => data.map((d) => ({
  content: [
    [
      {
        type: 'text',
        text: dateUtils.format(d.time, 'MM/DD HH:mm')
      }
    ],
    [
      {
        type: 'icon',
        text: d.code
      },
      {
        type: 'text',
        text: `${d.text} ${d.temperature}°`,
      }
    ]
  ],
  yAxis: [
    {
      data: d.temperature,
      type: TEMPLATE_DATA.CHART_TYPE.LINE
    },
    {
      data: d.code,
      combine: true,
      type: TEMPLATE_DATA.CHART_TYPE.ICON
    }
  ],
  xAxis: dateUtils.format(d.time, 'HH:mm'),
  date: d.time.split('T')[0],
  datetime: dateUtils.format(d.time, 'YYYY-MM-DDTHH:mm:ss'),
}))

export const airHourlyFormatterForChart = (data: {
  time: string
  aqi: string
  quality: string
}[]) => data.map((d) => ({
  content: [
    [
      {
        type: 'text',
        text: dateUtils.format(d.time, 'MM/DD HH:mm')
      }
    ],
    [
      {
        type: 'text',
        text: d.quality,
      },
      {
        type: 'text',
        text: d.aqi,
      }
    ]
  ],
  yAxis: [
    {
      data: d.aqi,
      inverse: true,
      type: TEMPLATE_DATA.CHART_TYPE.LINE
    },
    {
      data: d.quality,
      combine: true,
      type: TEMPLATE_DATA.CHART_TYPE.TEXT
    }
  ],
  xAxis: dateUtils.format(d.time, 'HH:mm'),
  date: d.time.split('T')[0],
  datetime: dateUtils.format(d.time, 'YYYY-MM-DDTHH:mm:ss'),
}))

export const drivingRestrictionFormatter = (restriction: {
  limits?: {
    date: string
    plates: string[]
    memo: string
  }[]
}, extra: {
  language: string
  index: number
  headerFormatter?: (data?: { date: string, memo: string }) => string
}) => {
  let header = '机动车尾号限行'
  const content = []
  const { index = 0 } = extra

  if (!restriction.limits || !restriction.limits.length) {
    content.push({
      text: '暂无数据',
      suffix: ''
    })
  } else {
    header = extra.headerFormatter
      ? extra.headerFormatter(restriction.limits[index])
      : restriction.limits[index].memo || header

    if (restriction.limits[index].plates.length) {
      content.push({
        text: restriction.limits[index].plates.join(','),
        suffix: ' 尾号'
      })
    } else {
      content.push({
        text: '无限行',
        suffix: ''
      })
    }
  }

  return {
    header,
    content
  }
}

export const suggestionFormatterForCarousel = (suggestion: {
  [key: string]: {
    brief: string
    details: string
  }
}, extra: { language: string }) => Object.keys(suggestion).map((key) => ({
  header: formatLocal(extra.language, key),
  content: [
    {
      text: suggestion[key].brief || 'N/A',
      suffix: ''
    }
  ]
}))

export const restrictionFormatterForCarousel = (restriction: {
  limits?: {
    date: string
    plates: string[]
    memo: string
  }[]
}, extra: { language: string }) => {
  if (!restriction || !restriction.limits || !restriction.limits.length) return null

  return restriction.limits.map(
    (_, index) => drivingRestrictionFormatter(
      restriction,
      Object.assign({}, extra, {
        index,
        headerFormatter: (data: { date: string, memo: string }): string =>
          `${dateUtils.format(data.date, 'MM/DD')} ${data.memo}`
      })
    )
  )
}
