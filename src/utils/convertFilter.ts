import { BaseEntity, FindConditions, Between, MoreThanOrEqual, LessThanOrEqual, Like, MoreThan, LessThan } from 'typeorm'
import { Filter } from 'admin-bro'
import { Property } from '../Property'

function safeParseJSON(json: string) {
  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

function safeParseNumber(str: string): (string | undefined)[] {
  const result = str.match(/([<=>]{1,2})?\s*?([\d]+[.]?[\d]*)(\s*?(~)\s*?([\d]+[.]?[\d]*))?/)

  if (result === null) {
    return new Array(5)
  }
  return result
}

export function convertFilter(filter?: Filter): FindConditions<BaseEntity> {
  if (!filter) return {}

  const { filters } = filter
  const where = {}
  for (const n in filters) {
    const one = filters[n]
    if (['number', 'float'].includes(one.property.type())) {
      const [, inequalitySign, value, , betweenSign, value2] = safeParseNumber(one.value as string)
      if (safeParseJSON(value as string) === null) {
        where[n] = null
      } else if (betweenSign) {
        where[n] = Between(Number(value), Number(value2))
      } else {
        switch (inequalitySign) {
        case '>=':
          where[n] = MoreThanOrEqual(Number(value))
          break
        case '<=':
          where[n] = LessThanOrEqual(Number(value))
          break
        case '>':
          where[n] = MoreThan(Number(value))
          break
        case '<':
          where[n] = LessThan(Number(value))
          break
        default:
          where[n] = Number(value)
          break
        }
      }
    } else if (['boolean', 'object', 'array'].includes(one.property.type())) {
      where[n] = safeParseJSON(one.value as string)
    } else if (['date', 'datetime'].includes(one.property.type())) {
      if (typeof one.value !== 'string' && one.value.from && one.value.to) where[n] = Between(new Date(one.value.from), new Date(one.value.to))
      else if (typeof one.value !== 'string' && one.value.from) where[n] = MoreThanOrEqual(new Date(one.value.from))
      else if (typeof one.value !== 'string' && one.value.to) where[n] = LessThanOrEqual(new Date(one.value.to))
    } else if ((one.property as Property).column.type === 'enum') {
      where[n] = one.value
    } else if ((one.property as Property).type() === 'reference') {
      // when comes to reference TypeORM cannot filter by referenceId: YOUR_FILTER_VALUE
      // I don't know why. But it filters by an object: reference: {id: YOUR_FILTER_VALUE}
      // propertyPath holds `reference.id` that is why we split it by `.`
      const [column, key] = (one.property as Property).column.propertyPath.split('.')
      where[column] = {
        [key]: one.value,
      }
    } else {
      where[n] = Like(`%${one.value}%`)
    }
  }
  return where
}
