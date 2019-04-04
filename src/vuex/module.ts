import cache from '../core/cache'
import { isFunction } from '../utils'

const state = {}
const mutations = {
  getApi (
    state: any,
    { apiNs, data, isInit }: { apiNs: string; data: any; isInit: boolean }
  ) {
    const { vue } = cache
    const [moduleName, apiName] = apiNs.split('/')
    if (!state[moduleName]) {
      vue.set(state, moduleName, {})
    }
    // 期望
    let commitData = data
    const apiConf = cache.store.getApiConf(apiNs) || {}
    if (apiConf && apiConf.config) {
      // 期望判定的函数
      const expect = apiConf.config.expect
      // 期望初始值
      let initialVal = apiConf.config.initialVal
      initialVal = Object.keys(apiConf.config).includes('initialVal')
        ? initialVal
        : null
      // 期望判定
      const expectationJudgment = expect && isFunction(expect) && expect(data)
      commitData = isInit
        ? initialVal
        : expectationJudgment
          ? data
          : initialVal
    }
    vue.set(state[moduleName], apiName, commitData)
  }
}

const actions = {
  addModule (store: any, storeApiNs: any) {
    Object.keys(storeApiNs).forEach(apiNs => {
      const [moduleName, apiName] = apiNs.split('/')
      if (
        !(
          store.state[moduleName] &&
          Object.keys(store.state[moduleName]).includes(apiName)
        )
      ) {
        store.commit('getApi', { apiNs, data: null, isInit: true })
      }
    })
  },
  async getApi (store: any, payload: any) {
    const { api: apiNs, ...apiPayload } = payload
    const apiNames = Object.keys(cache.store.apiNs)
    if (!apiNames.includes(apiNs)) {
      throw new Error(`[Block Vuex] 不存在的api ${apiNs}`)
    }
    const data = await cache.store.dispatch(apiNs, {
      ...apiPayload,
      isAction: true
    })
    const [moduleName, apiName] = apiNs.split('/')
    await store.commit('getApi', { apiNs, data })
    return store.getters.state[moduleName][apiName]
  }
}

/**
 * state属性同步至getter
 */
const generateGetters = () => {
  return Object.keys(state).reduce((getters: any, key) => {
    getters[key] = (state: any) => state[key]
    return getters
  }, {})
}

const getters = {
  state: (state: any) => state,
  ...generateGetters()
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
