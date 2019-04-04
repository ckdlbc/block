import Vue from 'vue'
import Store from './core/store'

declare module 'vue/types/vue' {
  interface Vue {
    $block: Store
  }
}
