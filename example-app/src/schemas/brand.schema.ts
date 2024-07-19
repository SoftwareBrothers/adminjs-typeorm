import { EntitySchema } from 'typeorm'
import { Brand } from '../interfaces/brand.interface.js'

export const BrandSchema = new EntitySchema<Brand>({
  name: 'Brand',
  tableName: 'brand',
  columns: {
    id: {
      primary: true,
      generated: 'uuid',
      type: 'uuid',
    },
    name: {
      type: 'varchar',
    },
    imgUrl: {
      type: 'varchar',
    },
  },
})
