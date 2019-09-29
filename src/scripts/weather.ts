
import * as WEATHER from '../utils/weather'
import { FULL_RIGHT } from '../utils/constant/rights'

export const widgetData = WEATHER.buildWidgetComponents(FULL_RIGHT)

console.log(widgetData)
