import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm'
import { Car } from './Car.js'

@Entity()
export class Seller extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column()
    name: string

  @OneToMany((type) => Car, (car) => car.seller)
    cars: Array<Relation<Car>>
}
