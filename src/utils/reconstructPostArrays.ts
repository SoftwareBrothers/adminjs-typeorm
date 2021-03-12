/**
 * @param obj an object where arrays are coded as xxx.1, xxx.2, etc.
 * @returns an object with all arrays reconstructed, and single values simply copied.
 *
 * e.g.
 * { 'foo.0': 'abc', 'foo.1': 'def', name: 'john smith' }
 * would return
 * { 'foo': ['abc', 'def'], name: 'john smith' }
 */

export const reconstructPostArrays = (obj: Record<string, any>): Record<string, any> => {
  const allKeys = Object.keys(obj)
  const resultObj = {}
  for (const key of allKeys) {
    // Does the key look like `foo.56` ?
    const match = key.match(/^([^.]+)\.(\d+)$/)
    if (match) {
      // Yes it does, so the real key is probably `foo`, and this is the item #56.
      const realKey = match[1]
      const indexInArray = +match[2]
      if (!resultObj[realKey]) {
        resultObj[realKey] = []
      }
      resultObj[realKey][indexInArray] = obj[key]
    } else {
      // No, it is a single value, we just copy it.
      resultObj[key] = obj[key]
    }
  }
  return resultObj
}
