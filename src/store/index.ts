import Vue from 'vue'
import Vuex from 'Vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
