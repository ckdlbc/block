import request, { http, urlConvert } from '../../src/core/request'
import cache from '../../src/core/cache'

describe('request', () => {
    it('http', () => {
        const apiHttp = http(
            cache.block,
            'http://www.groad.top:3000/mock/14',
            'get'
        )()
        expect(apiHttp).not.toBeUndefined()
    })
})
