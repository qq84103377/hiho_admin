import request from '@/utils/request'

// 品牌列表
export const listBrand = params => {
  return request.post(`/web/brand/listBrand`, params)
}
// 获取用户信息
export const showBrandDetail = params => {
  return request.get(`/web/brand/showBrandDetail`, { params: params })
}

// 新建品牌
export const saveBrand = params => {
  return request.post(`/web/brand/saveBrand`, params)
}

// 编辑品牌准备数据
export const showBrand = params => {
  return request.get(`/web/brand/showBrand`, { params: params })
}

// 删除品牌
export const deleteBrand = params => {
  return request.get(`/web/brand/deleteBrand`, { params: params })
}
