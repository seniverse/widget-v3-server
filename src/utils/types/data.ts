
interface TileSizeConfig {
  dataSource: string
  params: {
    [key: string]: string|number
  }
  template: {
    type: string
    [templateKey: string]: any
  }
}

export interface TileConfig {
  UIType: string
  dataType: string
  dataTTL: number
  size?: string
  availableSizes: string[]
  config: {
    [size: string]: TileSizeConfig[]
  }
}

export interface WidgetBaseConfig {
  unit: string
  flavor: string
  theme: string
  language: string
  location: string
  geolocation: boolean
  hover: string
}

interface RawWidgetConfig {
  key: string
  uid: string
  iid: string
  allowedDomains: string[]
  baseConfig: WidgetBaseConfig
  UIConfigs: {
    dataType: string
    size?: string
  }[]
}

export interface WidgetConfig extends RawWidgetConfig {
  id: string
  createdAt: Date
  updatedAt: Date
}
