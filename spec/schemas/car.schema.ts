import { EntitySchema } from 'typeorm'
import { CarType } from '../entities/Car.js'
import { Car } from '../interfaces/car.interface.js'

export const CarSchema = new EntitySchema<Car>({
  name: 'Car',
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
    model: {
      type: 'varchar',
      nullable: true,
    },
    age: {
      type: 'int',
      nullable: true,
    },
    stringAge: {
      type: 'int',
      nullable: true,
    },
    streetNumber: {
      type: 'varchar',
      nullable: true,
    },
    carType: {
      type: 'enum',
      enum: CarType,
      default: CarType.GHOST,
    },
    meta: {
      type: 'jsonb',
      nullable: true,
    },
    carDealerId: {
      type: 'uuid',
      nullable: true,
    },
    carBuyerId: {
      type: 'uuid',
      nullable: true,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
      name: 'created_at',
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
      name: 'updated_at',
    },
  },
  relations: {
    carDealer: {
      type: 'many-to-one',
      target: 'CarDealer',
      joinColumn: true,
      inverseSide: 'cars',
    },
    carBuyer: {
      type: 'many-to-one',
      target: 'CarBuyer',
      joinColumn: true,
      inverseSide: 'cars',
    },
  },
})
