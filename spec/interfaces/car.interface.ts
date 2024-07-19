import { CarType } from '../entities/Car'
import { CarBuyer } from './carBuyer.interface'
import { CarDealer } from './carDealer.interface'

export interface Car {
  id: number
  name: string
  model: string
  age: number
  stringAge: number
  streetNumber: string
  carType: CarType
  meta: any
  carDealer: CarDealer
  carDealerId: number
  carBuyer: CarBuyer
  carBuyerId: string
  createdAt: Date
  updatedAt: Date
}
