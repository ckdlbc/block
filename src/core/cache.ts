import { AxiosRequestConfig } from 'axios'
import Block from './block'
import { ApiRequest } from './request'
import Store from './store'
import { VueConstructor } from 'vue'
export interface InterceptorManager {
  error: (error: any) => any
  success: (value: any) => any | Promise<any>
}

export interface ApisRequestNS {
  [key: string]: ApiRequest
}

export interface ApisRequest {
  [key: string]: {
    [key: string]: ApiRequest;
  }
}

/**
 * 单例缓存
 */
class Cache {
  public config: AxiosRequestConfig
  public interceptor: InterceptorManager | object
  // block store 实例
  public store!: Store
  // 全局block
  public block: Block
  // 所有api的请求集合
  public apisRequest: ApisRequest
  // 命名空间api请求集合
  public namespaceApisRequest: ApisRequestNS
  // 新增api请求集合
  public namespaceModulesAdd: ApisRequestNS
  public vue!: VueConstructor
  // vuex store实例
  public vuex: any

  constructor (config?: AxiosRequestConfig) {
    this.config = config || {}
    this.interceptor = {}
    this.apisRequest = {}
    this.namespaceApisRequest = {}
    this.namespaceModulesAdd = {}
    this.vuex = {}
    this.block = new Block(config)
  }

  public create (config?: AxiosRequestConfig) {
    this.config = config || {}
    this.block = new Block(config)
  }
}
const cache = new Cache()

export default cache
