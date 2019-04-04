import ModuleCollection from '../module/moduleCollection'
import { Interceptors, RequestInterceptor, ResponseInterceptor } from './block'
import cache, { ApisRequest, ApisRequestNS } from './cache'
import { assert, objectOwnedAttr } from '../utils'
import { RawModule, ApisConfig } from '../module/module'
import { createApiPlugin, addVuexState } from '../vuex/plugin'

export interface StoreModules {
  [key: string]: RawModule
}

export interface StoreConfig {
  baseURL?: string
  timeout?: number
  withCredentials?: boolean
}

export interface RequestConfig {
  headers?: any
  qs?: boolean
  isFile?: boolean
  expect?: (res: any) => boolean
  initialVal?: any
}
export interface StoreOptions {
  modules: StoreModules
  request?: RequestInterceptor
  response?: ResponseInterceptor
  config?: StoreConfig
  Vue?: any
  vuex?: any
}

export interface ModulesNamespaceMap {
  [key: string]: ApisConfig
}

export type StoreConstructor = Store
export default class Store {
  private static modules: ModuleCollection
  private static modulesNamespaceMap: ApisConfig

  /**
   * 安装模块
   * @param modules
   */
  private static installModule (modules: StoreModules) {
    // 模块收集
    Store.modules = new ModuleCollection(modules)
    Store.modulesNamespaceMap = Store.modules.namespaceModules
  }

  /**
   * 注册全局拦截器
   */
  private static registerGlobalInterceptors (ints?: Interceptors) {
    if (objectOwnedAttr(ints)) {
      cache.block.addInts(ints)
    }
  }

  public api: ApisRequest
  public apiNs: ApisRequestNS

  constructor (options: StoreOptions) {
    const { modules, request, response, config, Vue, vuex } = options
    // 若有全局config，则新建实例
    if (config) {
      cache.create(config)
    }
    // 注册全局拦截器
    Store.registerGlobalInterceptors({ request, response })
    // 安装模块
    Store.installModule(modules || {})

    this.api = cache.apisRequest
    this.apiNs = cache.namespaceApisRequest

    cache.store = this

    if (Vue) {
      // 注册全局指令
      Vue.prototype.$block = this
      cache.vue = Vue
      // 注册vuex
      if (vuex) {
        createApiPlugin(vuex)
      }
    }
  }

  /**
   * 加载 vuex plugin
   * @param vuex
   */
  public vuexPlugin (vuexStore: any) {
    if (cache.vuex.store) {
      return
    }
    createApiPlugin(vuexStore)
  }

  /**
   * 注册block模块
   */
  public registerModule (modules: StoreModules) {
    Store.modules.register(modules)
    if (cache.vuex.store) {
      addVuexState()
    }
  }
  /**
   * 获取命名空间 api map
   */
  public getModulesNamespaceMap () {
    return Store.modulesNamespaceMap
  }

  /**
   * 获取指定api的配置项
   * @param apiNs
   */
  public getApiConf (apiNs: string) {
    return this.getModulesNamespaceMap()[apiNs].config || {}
  }

  /**
   * 获取api的模块名与名称
   * @param apiNs
   */
  getApiName (apiNs: string) {
    return apiNs.split('/')
  }

  /**
   * 单分发
   * @param type
   * @param payload
   */
  public dispatch (type: string, payload: any = {}) {
    const module = Store.modulesNamespaceMap[type]
    const { params, data, temp, config, isAction } = payload
    if (!module) {
      assert(process.env.NODE_ENV === 'production', `找不到: ${type}`)
      return
    }
    // 支持vuex
    if (cache.vuex.store && !isAction) {
      return cache.vuex.store.dispatch(`${cache.vuex.moduleName}/getApi`, {
        api: type,
        params,
        data,
        temp,
        config
      })
    } else {
      return module.request(params, data, temp, config)
    }
  }

  /**
   * 多分发
   * @param actions
   */
  public all (actions: Array<{ type: string; payload?: any }>) {
    const isArray = Array.isArray(actions)
    if (!isArray) {
      assert(isArray, `all的参数必须为actions集合`)
      return []
    }
    const promiseArr = actions.map(obj => {
      let payload = {
        params: {},
        data: {},
        temp: {},
        config: {},
        isAction: false
      }
      const type = obj.type
      const module = Store.modulesNamespaceMap[type]
      if (!type || !module) {
        assert(process.env.NODE_ENV === 'production', `找不到: ${type}`)
      }
      if (typeof obj.payload === 'object') {
        payload = obj.payload
      }
      const { params, data, temp, config, isAction } = payload
      // 支持vuex
      if (cache.vuex.store && !isAction) {
        return cache.vuex.store.dispatch(`${cache.vuex.moduleName}/getApi`, {
          api: type,
          params,
          data,
          temp,
          config
        })
      } else {
        return module.request(params, data, temp, config)
      }
    })
    return Promise.all(promiseArr)
  }
}
