import request from '@/utils/request'
// 用户列表
export const getUserSimples = params => {
  return request.get(`/web/user/getUserSimples`, { params: params })
}
// 业绩列表
export const getSalesPerformance = params => {
  return request.post(`/web/order/getSalesPerformance`, params)
}
// 业绩报表导出
export const getSalesExcel = params => {
  return request.post(`/web/order/getSalesExcel`, params, { responseType: 'blob' })
}