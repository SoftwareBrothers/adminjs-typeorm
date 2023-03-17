import { Entity } from 'typeorm'
import { Car } from './Car'

@Entity('car')
export class CarWithDeleted extends Car {
  static withDeleted = true
}
