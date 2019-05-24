import request from '@/utils/request'

// 获取后台用户列表
export const getUserList = params => {
  return request.post(`/web/user/getUserList`, params)
}

// 获取VIP列表
export const getVipList = params => {
  return request.get(`/web/user/getVipList`, {params: params})
}

// 获取VIP列表
export const getUserDetail = params => {
  return request.get(`/web/user/getUserDetail`, {params: params})
}

// 邀请码判重
export const judgeInviteCode = params => {
  return request.get(`/web/user/judgeInviteCode`, {params: params})
}

// 新增邀请码
export const addInviteCode = params => {
  return request.get(`/web/user/addInviteCode`, {params: params})
}

// 获取邀请码列表
export const getInviteCodeList = params => {
  return request.post(`/web/user/getInviteCodeList`, params)
}
