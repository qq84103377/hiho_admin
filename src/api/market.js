import request from '@/utils/request'
// 营销列表
export const getMarketManageList = params => {
  return request.post(`/web/marketing/getMarketManageList`, params)
}
// 新增营销消息
export const saveMarketManage = params => {
  return request.post(`/web/marketing/saveMarketManage`, params)
}
// 营销消息详情
export const getMarketManageDetail = params => {
  return request.get(`/web/marketing/getMarketManageDetail`, {params:params})
}
// 营销消息撤销
export const cancelMarketManage = params => {
  return request.get(`/web/marketing/cancelMarketManage`, {params:params})
}