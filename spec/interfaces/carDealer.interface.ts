import { Car } from './car.interface'

export interface CarDealer {
    id: string
    name: string
    cars: Array<Car>
}
