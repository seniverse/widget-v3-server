# Widget-V3 Server

> Server for seniverse widge v3

## How to develop

```bash
$ git clone
$ cd widget-v3-server
$ npm i

# 在 seniverse.com 内购买 API 产品，免费、付费版都可
# 之后进入控制台，找到购买好的产品实例，获取 API 密钥
# 将密钥配置到服务器或本机的 .bash_profile 或 .bashrc 文件中。以 .bashrc 为例
$ vim ~/.bashrc
# 例如，密钥为 123456，则加入 export SENIVERSE_API_KEY=123456，并刷新配置文件
$ source ~/.bashrc

# 生成插件
$ npm run init
```

`$ npm run init`命令将会根据用户在环境变量中配置的 API key，在数据库中插入一个插件实例，其中 插件的 UI 配置将会使用默认配置，而展示的数据配置则是全量配置，但实际渲染插件的时候则仅会根据 API key 的权限渲染数据。

### 插件的数据结构

```json
{
    // 用户 ID，和插件一一对应
    "uid" : "c1b5cd77-2323-46fe-90c8-4616b29e2bc7",
    // 代表插件需要展示的数据
    "UIConfigs" : [
        {
            // main.weather 无需 API key 权限要求，为心知免费赠送的基础数据，包含当前实况天气现象、当前温度、日出日落时间、今日昨日气温对比、气象灾害预警
            "dataType" : "main.weather"
        },
        {
            // 磁贴样式的实况天气现象，免费版 API 产品即可支持
            "dataType" : "tile.SENIVERSE.V3.weather.now.weather"
        },
        {
            // 磁贴样式的实况温度，免费版 API 产品即可支持
            "dataType" : "tile.SENIVERSE.V3.weather.now.temperature"
        },
        {
            // 磁贴样式的今日白天、夜间天气现象，免费版 API 产品即可支持
            "dataType" : "tile.SENIVERSE.V3.weather.daily.today_code"
        },
        {
            // 磁贴样式的今日最高、最低温，免费版 API 产品即可支持
            "dataType" : "tile.SENIVERSE.V3.weather.daily.today_temperature"
        },
        {
            // 轮播样式的逐日天气预报，免费版 API 产品可支持最近三天的数据
            "dataType" : "carousel.SENIVERSE.V3.weather.daily.weather"
        },
        {
            // 图表样式的逐日天气预报，免费版 API 产品可支持最近三天的数据
            "dataType" : "chart.SENIVERSE.V3.weather.daily.weather"
        },
        {
            // 轮播样式的生活指数，免费版 API 产品可支持基础 6 项数据
            "dataType" : "carousel.SENIVERSE.V3.life.suggestion.suggestion"
        }
    ],
    // 插件被调用时允许的调用方域名。可防止被他人盗取滥用。可为空，为空时则不做检查
    "allowedDomains" : [
        "localhost:3000",
        "127.0.0.1:3000"
    ],
    // 插件基本的 UI 样式配置
    "baseConfig" : {
        // 基础风格，有 bubble（浮动气泡）和 slim（固定极简）两种风格
        "flavor" : "bubble",
        // 鼠标 hover 操作时插件是否展开详情
        "hover" : "enabled",
        // 颜色主题，有 auto（色调根据天气实况改变）、dark（黑色主题）、light（白色主题）
        "theme" : "auto",
        // 插件默认地点，数据为 Seniverse V3 地点 ID
        "location" : "WX4FBXXFKE4F",
        // 是否自动定位。若开启自动定位且定位成功，将使用自动定位的地点，否则使用默认地点
        "geolocation" : false,
        // 插件语言，具体可见 https://docs.seniverse.com/api/start/language.html
        "language" : "zh-Hans",
        // 插件单位，具体可见 https://docs.seniverse.com/api/start/unit.html
        "unit" : "c"
    },
    // 插件 ID
    "id" : "93018354-6877-4a24-89ec-a380f271b51a",
    // 插件 token，将用于前端调用，获取具体天气数据
    "token": "93018354-6877-4a24-89ec-a380f271b51b",
    // API 产品密钥。切勿泄露
    "key" : "your api key"
}
```

### 项目结构

```
├── src                     # 项目源码
    ├── config              # 项目配置
    ├── middlewares         # 中间件
    ├── modules             # controller
    |   ├── shared          # 共享文件
    |   ├── weather         # 天气数据相关 controller
    |   ├── widget          # 插件配置相关 controller
    |   └── index           # 路由入口文件
    ├── script              # 初始化脚本
    ├── utils               # 公用函数
    |   ├── constant        # 常量文件，包括多语言支持、城市、schema 等
    |   ├── parser          # 数据源解析器，用于获取并解析心知天气 API 数据
    |   ├── weather         # 天气数据配置
    |   ├── types           # ts interface
    |   └── ...             # 其他 utils
    └── index.tsx           # 入口文件
```

## Intro

### 获取可配置项

Seniverse V3 插件可展示的数据，将会根据用户自己的 API key 决定。即 API 权限越多，可展示出的数据越多；除此之外，用户可以自行在 API 权限范围内决定某些数据是否展示、展示顺序。

通过`$ npm run weather-permission`可在终端打印出现阶段插件支持的所有数据（与用户 API 权限无关），例如：

```javascript
{
  'tile.SENIVERSE.V3.weather.now.weather': {
    UIType: 'tile',
    apiGroup: '天气实况',
    apiName: '天气现象'
  },
  'carousel.SENIVERSE.V3.weather.daily.weather': {
    UIType: 'carousel',
    apiGroup: '逐日预报',
    apiName: '天气'
  },
  'chart.SENIVERSE.V3.air.hourly.weather': {
    UIType: 'chart',
    apiGroup: '逐小时预报',
    apiName: '空气质量'
  }
}
```

如上数据，展示出了插件现有的三种 UI 样式：磁贴`tile`，轮播`carousel`以及图表`chart`。`carousel`和`chart`通常用来展示多批数据，例如逐日或逐小时的天气、空气质量，而`tile`则仅展示一条数据。如果需要自行修改插件上展示的数据，请先确认自己的 API 产品有该数据权限，然后修改数据库中该插件的`UIConfigs`字段。

### 获取插件天气数据

根据配置好的插件 ID 可获取到具体的天气数据：

```
GET /api/weather/:widgetToken
```

## Deploy

你可以使用心知提供的服务，或自行修改数据源的获取和解析，使用其他的天气数据。部署到生产环境前请注意编写 production.ts 文件，并合理修改部署脚本。

## License

[Apache License 2.0](./LICENSE)
