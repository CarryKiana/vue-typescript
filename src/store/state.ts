import Cookies from 'js-cookie'
import * as config from '@/utils/config'

interface State {
  [x: string]: string
}

const state: State = {
  loginName: Cookies.get(config.SET_LOGINNAME),
  sessionId: Cookies.get(config.SET_SESSIONID),
  userId: Cookies.get(config.SET_USERID),
  userType: Cookies.get(config.SET_USERTYPES),
  phone: Cookies.get(config.SET_USERPHONE),
  remember: Cookies.get(config.SET_REMEMBER) || false
}

export default state
