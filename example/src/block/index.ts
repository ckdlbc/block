import Block from '../../../src/index';
import user from './user';
import Vue from 'vue';
import vuex from '../vuex/store';

const apiStore = new Block.Store({
  modules: {
    user,
  },
  Vue,
  vuex,
});
export default apiStore;
