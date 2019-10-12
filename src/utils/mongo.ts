
import * as mongodb from 'mongodb'
import logger from './logger'

const instance = {}

export const getMongo = (options: { url: string, dbName: string }): Promise<mongodb.Db> => {
  const {
    url,
    dbName
  } = options

  return new Promise((resolve, reject) => {
    if (instance[url]) {
      resolve(instance[url])
    } else {
      mongodb.MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) {
          logger.error(err)
          reject(err)
        }
        logger.info(`[MONGODB CONNECTED] ${JSON.stringify(options)}`)
        const db = client.db(dbName)
        instance[url] = db
        resolve(db)
      })
    }
  })
}

export async function initDatabaseIndexs(options: { url: string, dbName: string }) {
  const db = await getMongo(options)

  try {
    await db.collection('widget').createIndex(
      { id: 1 },
      { name: 'widget_id_unique', unique: true, background: true }
    )

    await db.collection('widget').createIndex(
      { token: 1 },
      { name: 'widget_token', background: true }
    )

    await db.collection('widget').createIndex(
      { uid: 1 },
      { name: 'widget_uid', background: true }
    )
  } catch (e) {
    logger.error(e)
  }
}
