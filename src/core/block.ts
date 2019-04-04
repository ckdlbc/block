import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { forEachValue } from '../utils'

export type Action = 'addReqInterceptors' | 'addResInterceptors'
export type InterceptorType = 'request' | 'response'

export interface Interceptor<V> {
  error?: (error: any) => any
  success?: (value: V) => V | Promise<V>
}
export type RequestInterceptor = Interceptor<AxiosRequestConfig>
export type ResponseInterceptor = Interceptor<AxiosResponse>
export interface Interceptors {
  request?: RequestInterceptor
  response?: ResponseInterceptor
}

/**
 * Block
 */
class Block {
  public instance: AxiosInstance

  constructor (axiosConfig?: AxiosRequestConfig) {
    // 创建axios实例
    this.instance = Axios.create(axiosConfig)
  }

  /**
   * 添加request拦截器
   * @param manager
   */
  public addInterceptors (type: InterceptorType, interceptor: Interceptor<any>) {
    if (
      interceptor &&
      this.instance.interceptors[type] &&
      this.instance.interceptors[type].use
    ) {
      (this.instance.interceptors as any)[type].use(
        interceptor.success || {},
        interceptor.error || {}
      )
    }
  }

  /**
   * 创建新实例
   */
  public create (config?: AxiosRequestConfig) {
    // 创建axios实例
    const instance = Axios.create(config)
    this.instance = instance
    return instance
  }

  /**
   * 根据装饰器添加拦截器
   */
  public addInts (ints?: Interceptors) {
    if (!ints) {
      return
    }
    // 添加拦截器
    forEachValue(ints, (val, key) =>
      this.addInterceptors(key as InterceptorType, val)
    )
  }
}

export default Block
