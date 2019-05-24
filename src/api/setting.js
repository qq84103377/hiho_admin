import request from '@/utils/request'

// 获取后台用户列表
export const operationUserList = () => {
  return request.get(`/web/settings/getOperationUserList`)
}

// 后台用户密码修改
export const operationUserPsw= params => {
    return request.get(`/web/settings/resetOperationUserPsw`, {params: params})
}

// 删除后台用户
export const deleteOperationUser = params => {
    return request.get(`/web/settings/deleteOperationUser`, {params: params})
}

// 运费模块列表
export const freightTempleteList = () => {
    return request.get(`/web/settings/getFreightTempleteList`)
}

// 运费模块列表(新)
export const getFreights = params => {
  return request.get(`/web/freightTemplete/getFreights`, {params: params})
}

// 新增/编辑运费模板
export const saveFreightTemplete = params => {
  return request.post(`/web/freightTemplete/saveFreightTemplete`, params)
}

export const deleteFreightTemplete = params => {
  return request.get(`/web/freightTemplete/deleteFreightTemplete`, {params: params})
}

// 更新运费模板
export const updateFreightTemplete = params => {
    return request.get(`/web/settings/updateFreightTemplete`, {params: params})
}

// 后台退货地址列表
export const operationAddressList = () => {
    return request.get(`/web/settings/getOperationAddressList`)
}

// 编辑后台退货地址
export const updateOperationAddress = params => {
    return request.post(`/web/settings/updateOperationAddress`, params)
}

// 后台收款账号列表
export const operationAccountList = params => {
    return request.get(`/web/settings/getOperationAccountList`, {params: params})
}

// 编辑后台收款账号
export const updateOperationAccount = params => {
    return request.post(`/web/settings/updateOperationAccount`, params)
}

// 用户指南列表
export const getGuides = () => {
  return request.get(`/web/guide/getGuides`)
}

// 新建/编辑用户指南分类
export const saveGuideAssort = params => {
  return request.post(`/web/guideAssort/saveGuideAssort`, params)
}

// 删除用户指南
export const deleteGuide = params => {
  return request.get(`/web/guide/deleteGuide`, {params: params})
}

// 新增/编辑用户指南
export const saveGuide = params => {
  return request.post(`/web/guide/saveGuide`, params)
}
