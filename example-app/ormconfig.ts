import dotenv from 'dotenv'
import { DataSourceOptions } from 'typeorm'
import { Car, Seller, User } from './src/entities/index.js'
import { BrandSchema } from './src/schemas/brand.schema.js'

dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DATABASE || 'database_test',
  entities: [User, Car, Seller, BrandSchema],
  synchronize: true,
  logging: true,
}
