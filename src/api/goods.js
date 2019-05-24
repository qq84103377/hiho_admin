import request from '@/utils/request'

// 商品列表
export const listGoods = params => {
  return request.post(`/web/goods/listGoods`, params)
}
// 单件商品上架
export const upGoods = params => {
  return request.get(`/web/goods/upGoods`, { params: params })
}

// 单件商品下架
export const downGoods = params => {
  return request.get(`/web/goods/downGoods`, { params: params })
}

// 单件商品删除
export const delGoods = params => {
  return request.get(`/web/goods/delGoods`, { params: params })
}

// 商品批量下架
export const batchDownGoods = params => {
  return request.post(`/web/goods/batchDownGoods`, params)
}

// 商品批量删除
export const batchDelGoods = params => {
  return request.post(`/web/goods/batchDelGoods`, params)
}

// 商品批量库存清零
export const batchEmptyStock = params => {
  return request.post(`/web/goods/batchEmptyStock`, params)
}

// 修改商品库存弹窗展示的数据
export const editStockPage = params => {
  return request.get(`/web/goods/editStockPage`, { params: params })
}

// 修改或新增商品
export const saveGoods = params => {
  return request.post(`/web/goods/saveGoods`, params)
}

// 修改或新增商品
export const showGoodsPage = params => {
  return request.get(`/web/goods/showGoodsPage`,  { params: params })
}

// 修改商品库存
export const editStock = params => {
  return request.post(`/web/goodsspec/editStock`, params)
}

// 商品详情
export const showGoodsDetail = params => {
  return request.get(`/web/goods/showGoodsDetail`, { params: params })
}

// 获取模板列表
export const getSimpleList = params => {
  return request.get(`/web/freightTemplete/getSimpleList`, { params: params })
}

// 获取品类列表
export const getSimpleCategories = params => {
  return request.get(`/web/category/getSimpleCategories`, { params: params })
}

// 获取品类列表
export const checkIfBound = params => {
  return request.get(`/web/goodsspec/checkIfBound`, { params: params })
}
// 获取品类列表
export const createPuzzlePicOfGoods = params => {
  return request.post(`/web/goods/createPuzzlePicOfGoods`, params)
}

// 获取商品销量
export const getSaleNum = params => {
  return request.get(`/web/goods/getSaleNum`, { params: params })
}
