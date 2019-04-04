import cache from '../core/cache'
import module from './module'

export const createApiPlugin = (store: any) => {
  if (cache.vuex.store) {
    return
  }
  const moduleName = 'api'
  cache.vuex.moduleName = moduleName
  cache.vuex.store = store
  store.registerModule(moduleName, module)
  store.dispatch('api/addModule', cache.store.apiNs)
}

export const addVuexState = () => {
  const { vuex } = cache
  vuex.store.dispatch('api/addModule', cache.namespaceModulesAdd)
}
