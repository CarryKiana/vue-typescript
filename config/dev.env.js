'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    //开发环境
    // BASE_API: '"http://192.168.1.12:8370/gimc-dsp-webapp/"',
    // LOGIN_API: '"http://192.168.1.12:8380/gimc-dspadmin-webapp"',

    // 测试环境
    BASE_API: '"http://192.168.1.31:30017/gimc-dsp-webapp/"',
    LOGIN_API: '"http://192.168.1.31:30018/gimc-dspadmin-webapp"'
})
