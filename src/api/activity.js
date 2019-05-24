import request from '@/utils/request'

// 活动列表
export const listActivity = params => {
  return request.post(`/web/activity/getActivityList`, params)
}
// 新增活动
export const addActivity = params => {
  return request.post(`/web/activity/addActivity`, params)
}

// 编辑活动
export const updateActivity = params => {
  return request.post(`/web/activity/updateActivity`, params)
}

// 获取商品头图
export const headPicListOfGoods = params => {
  return request.post(`/web/activity/getHeadPicListOfGoods`, params)
}

// 活动详情
export const activityDetail = params => {
  return request.get(`/web/activity/getActivityDetail`,  { params: params })
}

// 活动详情商品列表
export const goodsOfActivity = params => {
  return request.get(`/web/activity/getGoodsOfActivity`, { params: params })
}

// 活动详情移除商品
export const removeGoods = params => {
  return request.post(`/web/activity/removeGoodsFromActivity`,  params)
}
