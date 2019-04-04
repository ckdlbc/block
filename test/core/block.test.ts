import Block from '../../src/core/block'

describe('block', () => {
    it('create method', () => {
        const bk = new Block()
        const instance = bk.create({ baseURL: '/api' })

        expect(instance.defaults.baseURL).toBe('/api')
    })

    it('addInterceptors method', () => {
        const bk = new Block()
        bk.addInterceptors('request', {} as any)

        expect(Object.keys(bk.instance.interceptors.request)).toEqual([
            'handlers'
        ])
    })
})
