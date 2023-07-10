import { FilterElement, flat } from 'adminjs';
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

const CUSTOM_KEY = 'custom';

const isCustomFilter = (filter: any) => filter[CUSTOM_KEY];
const isRawCustomFilter = (filter: FilterElement) => {
  const normalized: FilterElement = flat.unflatten(
    flat.flatten(filter.value, { delimiter: flat.DELIMITER }),
    { delimiter: flat.DELIMITER },
  );

  return isCustomFilter(normalized);
};

const isParserForType: FilterParser['isParserForType'] = (
  filter: FilterElement,
) => isCustomFilter(filter) || isRawCustomFilter(filter);

const readFilterValue = (filter: FilterElement): any => {
  if (isRawCustomFilter(filter)) {
    const normalized = flat.unflatten(
      flat.flatten(filter.value, { delimiter: flat.DELIMITER }),
      { delimiter: flat.DELIMITER },
    );

    return normalized[CUSTOM_KEY];
  }

  return filter[CUSTOM_KEY];
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
 * import {PARAM_SEPARATOR} from 'adminks';
 * const testResource = {
 *     resource: YOUR_RESOURCE,
 *     actions: {
 *         list: {
 *            before(request, context) {
 *               request.query[`filters.YOUR_FILTER_KEY~~custom`] = In([1, 2, 3]),
 *               return request;
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
