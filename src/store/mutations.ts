import * as types from './mutation-types'

interface Mutation {
  [x: string]: (state: any, str: string) => void
}

const mutations: Mutation = {
  [types.SET_LOGINNAME] (state: any, loginName: string): void {
    state.loginName = loginName
  },
  [types.SET_SESSIONID] (state: any, sessionId: string): void {
    state.sessionId = sessionId
  },
  [types.SET_USERID] (state: any, userId: string): void {
    state.userId = userId
  },
  [types.SET_USERTYPES] (state: any, userType: string): void {
    state.userType = userType
  },
  [types.SET_USERPHONE] (state: any, phone: string): void {
    state.phone = phone
  },
  [types.SET_REMEMBER] (state: any, remember: string): void {
    state.remember = remember
  }
}

export default mutations
