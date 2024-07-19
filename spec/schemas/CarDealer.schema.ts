import { EntitySchema } from 'typeorm'
import { CarDealer } from '../interfaces/carDealer.interface'

export const CarDealerSchema = new EntitySchema<CarDealer>({
  name: 'CarDealer',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'increment',
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
