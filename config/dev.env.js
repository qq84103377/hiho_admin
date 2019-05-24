'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://factory-alpha.juniusoft.com/hiho/"',
  // BASE_API: '"http://factory-alpha.juniusoft.com/yyzx/"',
  // BASE_API: '"http://192.168.31.132:9083"',
})
