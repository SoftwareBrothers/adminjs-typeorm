import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, RelationId, ManyToOne, Relation } from 'typeorm'
import { User } from './User.js'
import { Seller } from './Seller.js'

@Entity()
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    name: string

  @Column({
    type: 'jsonb',
    nullable: true,
  })
    meta: any

  @ManyToOne((type) => User, (user) => user.cars)
    owner: Relation<User>

  @ManyToOne((type) => Seller, (seller) => seller.cars)
    seller: Relation<User>

  // in order be able to fetch resources in adminjs - we have to have id available
  @RelationId((car: Car) => car.owner)
    ownerId: number

  @RelationId((car: Car) => car.seller)
    sellerId: string
}
