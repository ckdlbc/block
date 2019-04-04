import { ModuleParameter, http, ApiRequest } from '../core/request'
import Block, {
  Interceptors,
  RequestInterceptor,
  ResponseInterceptor
} from '../core/block'
import cache from '../core/cache'
import { StoreConfig, RequestConfig } from '../core/store'
import { assert, forEachValue, isObject, objectOwnedAttr } from '../utils'

/**
 * api 单模块实例
 */
export interface RawModule {
  api: {
    [key: string]: (string | RequestConfig)[];
  }
  request?: RequestInterceptor
  response?: ResponseInterceptor
  config?: StoreConfig
}

export interface ApisConfigCollect {
  [key: string]: any
}

export interface ApisConfig {
  [key: string]: {
    config: {
      method: string;
      url: string;
      config?: RequestConfig;
    };
    request: ApiRequest;
  }
}

export interface RawModuleProto {
  [key: string]: any
  api: {
    [key: string]: ModuleParameter;
  }
  baseURL?: string
  request?: RequestInterceptor
  response?: ResponseInterceptor
  addInterceptor?: boolean | undefined
}

export interface ApisRequest {
  [key: string]: ApiRequest
}
/**
 * module 数据收集
 */
export default class Module {
  // block实例
  public block: Block
  // 当前模块的baseURL
  public baseURL!: string
  // 当前模块的拦截器
  public interceptors!: Interceptors
  // 当前模块所有的api
  public apisConfig: ApisConfig
  // 是否需要加载拦截器
  public addInterceptor!: boolean
  // 是否需要创建新实例
  public createNew!: boolean
  // 父级模块名称
  public parentName!: string
  // 命名空间api配置集合
  public namespaceApisConfig: ApisConfig

  constructor (rawModule: RawModule, parentName: string) {
    this.baseURL = ''
    this.interceptors = {}
    this.apisConfig = {}
    this.addInterceptor = false
    this.parentName = parentName
    this.namespaceApisConfig = {}
    this.block = cache.block

    this.init(rawModule)
  }

  /**
   * 获取单个api项
   * @param key
   */
  public getChild (key: string) {
    return this.apisConfig[key]
  }

  /**
   * 初始化单模块
   * @param rawModule 单模块实例
   */
  private init (rawModule: RawModule) {
    const { api, request, response, config } = rawModule
    this.addInterceptor = [request, response].some(obj => objectOwnedAttr(obj))
    this.createNew = this.addInterceptor || objectOwnedAttr(config)

    // 收集拦截器
    if (this.addInterceptor) {
      this.interceptorsCollect(request, response)
    }

    if (this.createNew) {
      this.block = blockSelect(config, { request, response })
    }
    this.apiCollect(api)
  }

  /**
   * api收集
   * @param api
   */
  private apiCollect (api: ApisConfigCollect) {
    assert(objectOwnedAttr(api), '至少有一个api')
    cache.namespaceModulesAdd = {}
    forEachValue(api, (data, modulesName) => {
      let [method, url, config] = data
      // 请求方法正确性检测
      this.methodsHandle(modulesName, method)
      method = method.toLowerCase()

      // url正确性检测
      assert(typeof url === 'string', `${modulesName}：请求url必须为string`)

      if (config) {
        // config正确性检测
        assert(isObject(config), `${modulesName}：请求config必须为object`)
      }

      const namespace = `${this.parentName}/${modulesName}`

      const apiConf = {
        config: {
          method,
          url,
          config
        },
        request: http(this.block, url, method, config)
      }

      this.namespaceApisConfig[namespace] = this.apisConfig[
        modulesName
      ] = apiConf

      cache.namespaceApisRequest[namespace] = cache.namespaceModulesAdd[
        namespace
      ] =
        apiConf.request

      if (!cache.apisRequest[`${this.parentName}`]) {
        cache.apisRequest[`${this.parentName}`] = {}
      }
      cache.apisRequest[`${this.parentName}`][modulesName] = apiConf.request
    })
  }

  /**
   * 请求方法正确性检测
   * @param modulesName
   * @param method
   */
  private methodsHandle (modulesName: string, method: string) {
    const methods = ['get', 'post', 'delete', 'put', 'patch']
    assert(typeof method === 'string', `${modulesName}：请求方法必须为string`)
    assert(
      methods.includes(method.toLowerCase()),
      `${modulesName}：不支持${method}`
    )
  }
  /**
   * 拦截器收集
   * @param request
   * @param response
   */
  private interceptorsCollect (
    request?: RequestInterceptor,
    response?: ResponseInterceptor
  ) {
    this.interceptors = {
      request,
      response
    }
  }
}

/**
 * 根据模块是否定义拦截器来判断是否使用新block实例
 * @param addInterceptor // 是否需要加载子模块装饰器
 * @param ints
 */
export function blockSelect (config?: StoreConfig, ints?: Interceptors) {
  let block = cache.block
  if (objectOwnedAttr(config) || objectOwnedAttr(ints)) {
    block = new Block(config)
    block.addInts(
      ints && (ints.request || ints.response) ? ints : cache.interceptor
    )
  }
  return block
}
