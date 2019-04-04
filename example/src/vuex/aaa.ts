export default {
  namespaced: true,
  state: {
    a: 1,
  },
  mutations: {},
  actions: {},
  getters: {
    getRootInfo: (state, getters, rootState, rootGetters) => {
      console.log('变化', rootState.api.user.getRootInfo);
      return rootState.api.user.getRootInfo;
    },
  },
};
