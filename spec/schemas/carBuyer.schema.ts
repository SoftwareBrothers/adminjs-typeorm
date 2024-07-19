import { EntitySchema } from 'typeorm'
import { CarBuyer } from '../interfaces/carBuyer.interface'

export const CarBuyerSchema = new EntitySchema<CarBuyer>({
  name: 'CarBuyer',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      nullable: false,
    },
  },
  relations: {
    cars: {
      target: 'Car',
      type: 'one-to-many',
      joinColumn: true,
      cascade: true,
    },
  },
})
