import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
    landmarks: [
      {
        id: 1,
        title: 'Landmark #1',
        latitude: 55.75,
        longitude: 37.61
      }
    ]
  },
  mutations: {
    ADD_LANDMARK: (state, landmark) => {
      landmark && state.landmarks.push(landmark)
      state.landmarks = state.landmarks.filter(i => !!i)
    },
    SET_LOADING_STATUS: (state, status) => state.isLoading = status
  },
  actions: {
    ADD_LANDMARK: ({ state, commit }, landmark) => {
      commit('SET_LOADING_STATUS', true)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('ADD_LANDMARK', landmark)
          commit('SET_LOADING_STATUS', false)
          resolve()
        }, 2000)
      })
    }
  },
  modules: {
  }
})
