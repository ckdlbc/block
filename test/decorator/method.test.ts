import method from '../../src/decorator/method'

describe('method', () => {
    it('methodDecorator', () => {
        // error
        expect(() => {
            const get = method('get', '/user', {})
            get('', '', {})
        }).toThrowError(
            '@(get|put|post|delete) 装饰器只能应用于function，而不是undefined'
        )
    })

    it('urlCompletion', () => {
        const get = (url: string, config?: any) => {
            return method('GET', url, config)
        }
        expect(() => {
            get('', {})
        }).toThrowError('[block]请传入正确的restful url')

        let data = get('/user', {})({ baseURL: '/api' }, '', {
            value: () => {}
        })

        expect(data.value.baseURL).toBe('/api')
        expect(data.value.method).toBe('GET')
        expect(data.value.url).toBe('/api/user')

        let data1 = get('user', {})({ baseURL: '/api/' }, '', {
            value: () => {}
        })

        expect(data.value.url).toBe('/api/user')
    })
})
