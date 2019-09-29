
import * as uuid from 'uuid'
import { WIDGET_DATAS, DEFAULT_WIDGET_BASE_CONFIG } from '../utils/constant/data'
import { getMongo } from '../utils/mongo'
import config from '../config'
import { widgetData } from './weather'

const UID = '123-456-789'
const KEY = process.env.SENIVERSE_API_KEY

const inject = async () => {
  const db = await getMongo(config.store.mongo)
  const result = await db.collection('widget').findOneAndUpdate(
    { uid: UID },
    {
      $set: {
        key: KEY,
        allowedDomains: [
          'http://localhost:3001',
          'http://localhost:3000',
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

  console.log(JSON.stringify(result))

  process.exit(0)
}

inject()
