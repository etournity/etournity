/**
 * Method to check whether or not a object is empty
 * by its amount of set keys.
 * @param obj Object to be tested for emptyness.
 */
export const isObjectEmpty = (obj: Record<string, unknown>): boolean =>
  Object.entries(obj).length === 0
