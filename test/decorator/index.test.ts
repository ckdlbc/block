import { get, post, put, del } from '../../src/decorator/index'
import Module from '../../src/module/module'

describe('block', () => {
    it('method decorators', () => {
        class User {
            @get('/get')
            public get() {}

            @post('/post')
            public post() {}

            @put('/put')
            public put() {}

            @del('/del')
            public del() {}
        }
        const module1 = new Module(new User() as any, 'user')

        expect(module1.namespaceApisConfig['user/get'].config.method).toBe(
            'GET'
        )

        expect(module1.namespaceApisConfig['user/post'].config.method).toBe(
            'POST'
        )

        expect(module1.namespaceApisConfig['user/put'].config.method).toBe(
            'PUT'
        )

        expect(module1.namespaceApisConfig['user/del'].config.method).toBe(
            'DELETE'
        )
    })
})
