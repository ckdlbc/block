import Module, { blockSelect } from '../../src/module/module'
import { base, get, post, req, res } from '../../src/decorator/index'
import cache from '../../src/core/cache'
import http from '../../src/core/request'

@base('http://www.groad.top:3000/mock/14')
class User {
  @get('/get')
  public get () {}

  @post('/post')
  public post () {}

  @req('success')
  public reqSuccess () {}

  @req('error')
  public reqError (error: any) {}

  @res('success')
  public resSuccess (res: any) {
    return res
  }

  @res('error')
  public resError (error: any) {
    console.log(error)
  }
}

describe('Module', () => {
  it('parentName', () => {
    class User {
      @get('/get')
      public get () {}
    }
    const module = new Module(new User() as any, 'user')
    expect(module.parentName).toBe('user')
  })

  it('init method', async () => {
    @base('http://www.groad.top:3000/mock/14')
    class User1 {
      @get('/get')
      public get () {}
    }
    const module1 = new Module(new User1() as any, 'user')
    expect(module1.baseURL).toBe('http://www.groad.top:3000/mock/14')
    expect(module1.addInterceptor).toBe(false)
    expect(module1.block.instance.defaults.baseURL).toBe(
      'http://www.groad.top:3000/mock/14'
    )

    expect(module1.apisConfig).toHaveProperty('get')
    expect(module1.namespaceApisConfig).toHaveProperty('user/get')

    expect(Object.keys(module1.namespaceApisConfig['user/get'])).toEqual([
      'config',
      'request'
    ])
    expect(Object.keys(module1.namespaceApisConfig['user/get'].config)).toEqual(
      ['baseURL', 'url', 'method', 'config']
    )

    expect(module1.namespaceApisConfig['user/get']).toBe(
      module1.apisConfig.get
    )
    expect(cache.apisRequest.user.get).toBe(module1.apisConfig.get.request)

    class User2 {
      @get('/get')
      public get () {}
      @req('success')
      public reqSuccess () {}
      @req('error')
      public reqError (error: any) {}
      @res('success')
      public resSuccess (res: any) {
        return res
      }
      @res('error')
      public resError (error: any) {
        console.log(error)
      }
    }
    const module2 = new Module(new User2() as any, 'user')
    expect(module2.baseURL).toBe('')
    expect(module2.addInterceptor).toEqual(true)

    expect(module2.block.instance.defaults.baseURL).toBe('')

    expect(module2.block.instance.interceptors.request).toBeDefined()
    expect(module2.block.instance.interceptors.response).toBeDefined()

    expect(module2.interceptors.request).toHaveProperty('success')
    expect(module2.interceptors.request).toHaveProperty('error')
    expect(module2.interceptors.response).toHaveProperty('error')
    expect(module2.interceptors.response).toHaveProperty('error')
  })

  it('getChild', () => {
    class User {
      @get('/get')
      public get () {}
    }
    const module = new Module(new User() as any, 'user')
    expect(Object.keys(module.getChild('get'))).toEqual(['config', 'request'])
    expect(module.getChild('get').config.url).toBe('/get')
  })

  it('blockSelect', () => {
    expect(blockSelect()).toBe(cache.block)
    expect(blockSelect('www.api.com')).not.toBe(cache.block)
  })
})
