export function forEachValue (
  obj: { [key: string]: any },
  fn: (val: any, key: string) => void
) {
  Object.keys(obj).forEach((key: string) => fn(obj[key], key))
}

export function isObject (obj: any) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise (val: any) {
  return val && typeof val.then === 'function'
}

export function assert (condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[block] ${msg}`)
  }
}

export function isBoolean (val: any) {
  return typeof val === 'boolean'
}
export function isNil (val: any) {
  return val === null || val === undefined
}

export function objectOwnedAttr (obj: any) {
  return obj && isObject(obj) && !!Object.keys(obj).length
}

export function isFunction (obj: any) {
  return obj && typeof obj === 'function'
}
