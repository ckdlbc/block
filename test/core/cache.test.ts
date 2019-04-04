import cache from '../../src/core/cache'

describe('cache', () => {
    it('create method', () => {
        cache.create({ baseURL: '/api' })
        expect(cache.config.baseURL).toBe('/api')

        cache.create()
        expect(cache.config).toEqual({})
    })
})
