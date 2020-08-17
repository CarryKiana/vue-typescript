import gidMessage from './message/index'
import bigDataSuccess from './success/index'

const install = function (Vue) {
    Vue.component(gidMessage.name, gidMessage)
    Vue.prototype.$gidMessage = gidMessage.installMessage
    Vue.component(bigDataSuccess.name, bigDataSuccess)
    Vue.prototype.$gidSuccess = bigDataSuccess.installMessage
}

export default install
