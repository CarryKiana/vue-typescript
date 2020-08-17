const backIndex = () =>
    import('page/index.vue')

// 1、系统管理人员，2、运营管理人员，3、投放运营人员，4、广告代理商，5、广告主
// 后台路由
export const backRoutes = [{
  path: '/index',
  component: backIndex,
  icon: 'g-icon g-icon-msg',
  leaf: true, // 只有一个节点
  redirect: '/aindex',
  meta: {
    name: '首页',
    access: [2, 3]
  },
  children: [{
    path: '/aindex',
    name: 'aindex',
    hidden: true,
    component: () =>
            import('page/index/aindex.vue'),
    props: true,
    meta: {
      name: '首页',
      access: [2, 3]
    }
  }]
}, {
  path: '/index',
  component: backIndex,
  meta: {
    name: '系统设置',
    access: [1]
  },
  icon: 'g-icon g-icon-setting',
  children: [{
    path: '/user',
    name: 'user',
    component: () =>
                import('page/set/user.vue'),
    props: true,
    meta: {
      name: '账号管理',
      access: [1]
    }
  },
    {
      path: '/user-edit',
      name: 'user-edit',
      component: () =>
                import('page/set/edit.vue'),
      props: true,
      hidden: true,
      meta: {
        name: '账号编辑',
        access: [1]
      }
    }, {
      path: '/blacklist',
      name: 'blacklist',
      component: () => import('page/set/blacklist.vue'),
      meta: {
        name: '黑名单管理',
        access: [1]
      }
    }
  ]
}, {
  path: '/index',
  component: backIndex,
  meta: {
    name: '报表管理',
    access: [2, 3]
  },
  icon: 'g-icon g-icon-cms', // to check
  children: [{
    path: '/advreport',
    name: 'advreport',
    component: () =>
                import('page/report/advreport.vue'),
    props: true,
    meta: {
      name: '广告主报表',
      access: [2, 3]
    }
  },
    {
      path: '/flowreport',
      name: 'flowreport',
      component: () =>
                import('page/report/flowreport.vue'),
      props: true,
      meta: {
        name: '流量报表',
        access: [2, 3]
      }
    }
  ]
}]

// 公共路由
const publicRoutes = [{
  path: '/',
  name: 'login',
  component: () =>
            import('page/login.vue'),
  meta: {
    name: '登录'
  }
},
  {
    path: '/forgot',
    name: 'forgot',
    component: () =>
            import('page/forgot.vue'),
    props: true,
    meta: {
      name: '忘记密码'
    }
  },
  {
    path: '/changepass',
    name: 'changepass',
    component: () => import('page/changepass.vue'),
    meta: {
      name: '修改密码'
    }
  },
  {
    path: '/404', // 没定义的路由
    name: 'error',
    component: () =>
            import('page/error.vue'), // 跳转Error.vue(即404)
    meta: {
      name: '404',
      hidden: true
    }
  }
    // {
    //     path: "*", //没定义的路由
    //     name: 'error',
    //     component: () =>
    //         import('page/error'), //跳转Error.vue(即404)
    //     meta: {
    //         name: '404',
    //         hidden: true
    //     }
    // }
]

export const routes = [...backRoutes, ...publicRoutes]
