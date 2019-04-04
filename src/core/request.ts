import { AxiosInstance, AxiosPromise } from 'axios'
import UrlTemplate from 'url-template'
import { stringify } from 'qs'
import Block from './block'
import { RequestConfig } from './store'
import { assert, isObject, forEachValue, isNil } from '../utils'

/**
 * 装饰器返回参数
 */
export interface ModuleParameter {
  url: string
  method: string
  options?: AxiosInstance
  params: any
  data: any
  temp: any
}

/**
 * api请求方法
 */
export type ApiRequest = (
  params?: any,
  data?: any,
  temp?: any,
  callConfig?: RequestConfig
) => AxiosPromise<any>

/**
 * urlTemplate转换
 * @param url
 * @param data
 */
export function urlConvert (url: string = '', data: { [key: string]: any }) {
  const newUrl = UrlTemplate.parse(url).expand(data || {})
  const arr = url.split(/\{([^\{\}]+)\}|([^\{\}]+)/g)
  Object.keys(data).forEach(key => {
    if ((arr as any).includes(key)) {
      delete data[key]
    }
  })
  return {
    url: newUrl,
    data
  }
}

/**
 * 非空处理
 * @param params
 */
export function nilHandle (params: any) {
  if (isObject(params)) {
    forEachValue(params, (val, key) => {
      if (isNil(params[key])) {
        delete params[key]
      }
    })
  }
}

/**
 * headers转换
 * @param data
 * @param config
 */
export function headersHandle (data: any, config?: RequestConfig) {
  if (config && isObject(config)) {
    const { headers, qs, isFile } = config
    // qs支持
    if (qs) {
      config.headers = Object.assign({}, headers, {
        'Content-Type': 'application/x-www-form-urlencoded'
      })
      data = stringify(data)
    }
    // 文件上传支持
    if (isFile) {
      config.headers = Object.assign({}, headers, {
        'Content-Type': 'multipart/form-data'
      })
    }
  }
}
/**
 * 请求
 */
export const http = (
  block: Block,
  url: string,
  method: string,
  requestConfig?: RequestConfig
) => (params?: any, data?: any, temp?: any, callConfig?: RequestConfig) => {
  let config = {}
  if (isObject(requestConfig)) {
    config = { ...config, ...requestConfig }
  }
  if (isObject(callConfig)) {
    config = { ...config, ...callConfig }
  }
  return request(block, url, method, params, data, temp, config)
}

/**
 * request
 * @param block
 * @param url   请求url
 * @param method 请求方法
 * @param params 请求连接中的请求参数，必须是一个纯对象，或者URLSearchParams对象
 * @param data
 * 请求体需要设置的数据
 * 只适用于应用的'PUT','POST','PATCH'，请求方法
 * 当没有设置`transformRequest`时，必须是以下其中之一的类型（不可重复？）：
 * -string,plain object,ArrayBuffer,ArrayBufferView,URLSearchParams
 * -仅浏览器：FormData,File,Blob
 * -仅Node：Stream
 * @param options
 */
export default function request (
  block: Block,
  url: string,
  method: string,
  params: any,
  data: any,
  temp: any,
  config?: RequestConfig
) {
  // 对象的非空处理
  nilHandle(params)
  nilHandle(data)

  // urlTemplate转换
  if (isObject(temp)) {
    const template = urlConvert(url, temp)
    url = template.url
  }
  if (isObject(params)) {
    const template = urlConvert(url, params)
    url = template.url
    params = template.data
  }

  // headers转换
  headersHandle(data, config)

  // 配置
  const requestConf = {
    // 配置项
    ...config,
    method,
    url,
    params,
    data
  }
  // 发送请求
  return block.instance(requestConf)
}
