import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import api from '@/api'

import {
    routes
} from './router'
import {
    format
} from 'path'
Vue.use(Router)
let base = process.env.NODE_ENV === 'development' ? '/' : '/dspadmin/'
// // 路由器配置
const router: any = new Router({
  base: base,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  let whiteList = ['/', '/forgot', '/404']
  if (!store.state.sessionId) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/')
    }
  } else {
    api.login.isLogin({
      sessionId: store.state.sessionId
    }).then((res: any) => {
      if (+res.ret === 0) {
        if (to.path === '/') {
          if (+store.state.userType === 1) {
            next('/user')
          } else if (+store.state.userType === 2 || +store.state.userType === 3) {
            next('/aindex')
          }
        } else if (to.path === '/forgot') {
          next('/404')
        } else if (to.path === '/404') {
          next()
        } else
                if (!to.meta.access || to.meta.access.indexOf(+store.state.userType) !== -1) {
                  next()
                } else {
                  next('/404')
                }
      } else {
        store.dispatch('delUserInfo').then(res => {
          next('/')
        }).catch(_ => _)
      }
    }).catch(_ => _)
  }

})

// Vue项目中出现Loading chunk {n} failed问题解决
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})

export default router
