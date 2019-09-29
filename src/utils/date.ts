
import * as moment from 'moment'
import { TIMES } from './constant/data'

moment.locale('zh-cn')

const formatDate = (format?: string) =>
  (date?: moment.MomentInput): string => moment(date).format(format)

export default {
  toMoment: moment,
  format: (date: moment.MomentInput, f: string = 'YYYY-MM-DD') => formatDate(f)(date),
  validateDate: (date: moment.MomentInput, format: string = 'L') => formatDate(format)(date),
  toHuman(s: string | number, units: string[] = ['d', 'h', 'min', 's']): string {
    let num = parseInt(`${s}`, 10)
    if (isNaN(num)) return ''
    if (num <= 0) return ''

    num = Math.round(num)

    const sections = []

    if (num >= TIMES.DAY) {
      const day = Math.floor(num / (TIMES.DAY))
      sections.push(`${day}${units[0]}`)
      num -= TIMES.DAY * day
    }

    let index = 0
    let divisor = TIMES.HOURS
    while (num) {
      const n = Math.floor(num / divisor)
      if (n) {
        const unit = units[index + 1]
        if (!unit) break
        sections.push(`${n}${unit}`)
      }
      num -= n * divisor
      index += 1
      divisor /= 60
    }
    return sections.length ? sections.join(' ') : `0${units.slice(-1)[0]}`
  },
  calendar: (date: moment.MomentInput, language: string): string => {
    const diff = (moment(date).toDate().getTime() - moment(moment().format('YYYY-MM-DD')).toDate().getTime()) / TIMES.MS_PERDAY
    let d = ''
    if (/^zh/.test(language)) {
      switch (diff) {
        case -3:
          d = '大前天'
          break
        case -2:
          d = '前天'
          break
        case -1:
          d = '昨天'
          break
        case 0:
          d = '今天'
          break
        case 1:
          d = '明天'
          break
        case 2:
          d = '后天'
          break
        default:
          d = moment(date).format('dddd').replace('星期', '周')
          break
      }
    }
    const base = moment(date).format('M/D')
    return d ? `${base} ${d}` : base
  },
  clock: (date?: moment.MomentInput): string => {
    const m = moment(date)
    return m.format('M/D HH:mm')
  },
  daysOffset: (count: number, from?: moment.MomentInput): moment.Moment =>
    moment(from).add(count, 'days')
}
