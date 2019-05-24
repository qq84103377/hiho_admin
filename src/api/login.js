import request from '@/utils/request'

// 登录
export const login = params => {
  return request.post(`/web/operationUser/login`, params)
}
// 获取用户信息
export const getInfo = params => {
  return request.get(`/web/operationUser/getUser`, { params: params })
}
// 调试支付
export const pay = params => {
  return request.get(`web/h5/order/buyerWeixinPay`, { params: params })
}

// 调试支付
export const alipay = params => {
  return request.post(`/web/alipay/pay`, params)
}

