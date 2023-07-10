import { FilterElement, flat, Filter } from 'adminjs';
import { FilterParser } from './filter.types.js';

// Raw filter payload:
// {
//   path: 'writeoff',
//   property: undefined,
//   value: {
//     'custom.agentId.email': 'medz',
//     'custom.agentId.id': 'se8tETxe2GXoQW-iqGjod',
//     'custom.agentId.title': 'Seven',
//     'custom.agentId.role': 'administrator'
//   }
// }
// OR
// {
//   'custom.agentId.email': 'medz',
// }

const isCustomFilter = (filter: any) => filter?.custom;
const isRawCustomFilter = (filter: FilterElement) => {
  const normalized: FilterElement = flat.unflatten(
    flat.flatten(filter.value, { delimiter: flat.DELIMITER }),
    { delimiter: flat.DELIMITER },
  );

  return isCustomFilter(normalized.value);
};

const isParserForType: FilterParser['isParserForType'] = (
  filter: FilterElement,
) => isCustomFilter(filter) || isRawCustomFilter(filter);

const readFilterValue = (filter: FilterElement): any => {
  if (isRawCustomFilter(filter)) {
    return filter.value['custom'];
  }

  return filter['custom'];
};

const parse: FilterParser['parse'] = (
  filter: FilterElement,
  filterKey: string,
) => ({ filterKey, filterValue: readFilterValue(filter) });

/**
 * It wasn't possible to pass raw filters to adapters with AdminJS
 *
 * ### In your custom handler modify creating filter
 *
 * ```ts
 * const filter = new Filter(filters, resource);
 *
 * filter.filters[YOUR_FILTER_KEY] = {
 *     custon: In([1, 2, 3])
 * };
 * ```
 *
 * ### In AdminJS raw filter will be passed as:
 *
 * ```ts
 * const testResource = {
 *     resource: YOUR_RESOURCE,
 *     actions: {
 *         list: {
 *            before(request, context) {
 *               request.query['filters.YOUR_FILTER_KEY'] = {
 *                  custom: In([1, 2, 3]),
 *               },
 *            },
 *         }
 *     },
 * };
 * ```
 */
export const CustomParser: FilterParser = {
  isParserForType,
  parse,
};
