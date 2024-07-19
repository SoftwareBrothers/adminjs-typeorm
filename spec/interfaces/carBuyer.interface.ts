import { Car } from './car.interface'

export interface CarBuyer {
    id: string
    name: string
    cars: Array<Car>
}
