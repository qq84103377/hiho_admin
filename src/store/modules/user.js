import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    // name: '',
    // avatar: '',
    // roles: [],
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // SET_NAME: (state, name) => {
    //   state.name = name
    // },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    // },
    // SET_ROLES: (state, roles) => {
    //   state.roles = roles
    // },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        const params = {
          phone: userInfo.phone,
          password: userInfo.password
        }
        login(params).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo({ token: state.token }).then(response => {
          const data = response.data
          if (data) { // 验证返回的roles是否是一个非空数组
            console.log(data, '设置前')
            commit('SET_USER_INFO', data)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       // commit('SET_ROLES', [])
    //       removeToken()
    //       resolve
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
