import { buildRouter } from '@adminjs/express'
import { Database, Resource } from '@adminjs/typeorm'
import AdminJS from 'adminjs'
import express from 'express'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { dataSourceOptions } from '../ormconfig.js'
import { Car } from './entities/Car.js'
import { Seller } from './entities/Seller.js'
import { User } from './entities/User.js'
import { BrandSchema } from './schemas/brand.schema.js'

AdminJS.registerAdapter({ Database, Resource })

const PORT = 3000

const run = async () => {
  const dataSource = await new DataSource(dataSourceOptions).initialize()
  const app = express()
  const admin = new AdminJS({
    resources: [{
      resource: User,
      options: {
        properties: {
          firstName: {
            isTitle: true,
          },
        },
      },
    }, {
      resource: Car,
      options: {
        properties: {
          'meta.title': {
            type: 'string',
          },
          'meta.description': {
            type: 'string',
          },
        },
      },
    }, Seller, {
      schema: BrandSchema,
      dataSource,
    }],
  })
  const router = buildRouter(admin)

  app.use(admin.options.rootPath, router)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

run()
