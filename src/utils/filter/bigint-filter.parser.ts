import { Property } from '../../Property'
import { FilterParser } from './filter.types'

export const BigintParser: FilterParser = {
  isParserForType: (filter) => (filter.property as Property).column.type === 'bigint',
  parse: (filter, fieldKey) => ({ filterKey: fieldKey, filterValue: filter.value }),
}