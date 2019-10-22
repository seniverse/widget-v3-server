
import * as uuid from 'uuid'
import { WIDGET_DATAS, DEFAULT_WIDGET_BASE_CONFIG } from '../utils/constant/data'
import { getMongo } from '../utils/mongo'
import config from '../config'
import { widgetData } from './weather'

const UID = uuid.v4()
const KEY = process.env.SENIVERSE_API_KEY

if (!KEY) throw new​​ Error(`can not find SENIVERSE_API_KEY in env. Check README.md for more details`)

const inject = async () => {
  const db = await getMongo(config.store.mongo)
  const result = await db.collection('widget').findOneAndUpdate(
    { uid: UID },
    {
      $set: {
        key: KEY,
        allowedDomains: [
          'localhost:3000',
          '127.0.0.1:3000'
        ],
        baseConfig: DEFAULT_WIDGET_BASE_CONFIG,
        UIConfigs: [
          {
            dataType: WIDGET_DATAS.MAIN.dataType,
          },
          ...Object.keys(widgetData).map(dataType => ({
            dataType
          }))
        ]
      },
      $setOnInsert: {
        id: uuid.v4()
      }
    },
    { upsert: true, returnOriginal: false }
  )

  console.log('\n插件已生成，具体配置为：')
  console.log(JSON.stringify(result.value))
  console.log(`其中 token 字段对应的数据 ${result.value.token} 用于给前端调用，获取天气数据`)

  process.exit(0)
}

inject()
