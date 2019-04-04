import { forEachValue, isObject, isPromise, assert } from '../src/utils'

describe('util', () => {
    it('forEachValue', () => {
        let number = 1

        function plus(value: number, key: string) {
            number += value
        }
        const origin = {
            a: 1,
            b: 3
        }

        forEachValue(origin, plus)
        expect(number).toEqual(5)
    })

    it('isObject', () => {
        expect(isObject(1)).toBe(false)
        expect(isObject('String')).toBe(false)
        expect(isObject(undefined)).toBe(false)
        expect(isObject({})).toBe(true)
        expect(isObject(null)).toBe(false)
        expect(isObject([])).toBe(true)
        expect(isObject(new Function())).toBe(false)
    })

    it('isPromise', () => {
        const promise = new Promise(() => {})
        expect(isPromise(1)).toBe(false)
        expect(isPromise(promise)).toBe(true)
        expect(isPromise(new Function())).toBe(false)
    })

    it('assert', () => {
        expect(assert.bind(null, false, 'Hello')).toThrowError('[block] Hello')
    })
})
