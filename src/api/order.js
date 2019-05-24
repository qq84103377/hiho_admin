import request from '@/utils/request'

// 订单列表
export const getOrderList = params => {
  return request.post(`/web/order/getOrderList`, params)
}

// 订单详情
export const getOrderDetail = params => {
  return request.get(`/web/order/getOrderDetail`, { params: params })
}
// 订单发货
export const deliveryGoods = params => {
  return request.get(`/web/order/deliveryGoods`, { params: params })
}

// 售后单列表
export const listRefundOrder = params => {
  return request.post(`/web/refund/listRefundOrder`, params)
}

// 售后单详情
export const showRefundDetail = params => {
  return request.get(`/web/refund/showRefundDetail`, { params: params })
}

// 售后单同意退货
export const agreeReturn = params => {
  return request.get(`/web/refund/agreeReturn`, { params: params })
}

// 售后单拒绝退款
export const refuseRefund = params => {
  return request.get(`/web/refund/refuseRefund`, { params: params })
}
// 售后单确认收到退货
export const confirmReturn = params => {
  return request.get(`/web/refund/confirmReturn`, { params: params })
}

// 确认退款
export const confirmRefund = params => {
  return request.get(`/web/refund/confirmRefund`, { params: params })
}

// 获取物流信息
export const getCompaniesH5 = params => {
  return request.get(`/web/h5/logistics/getCompaniesH5`, { params: params })
}

// 批量发货
export const batchDelivery = (params, config) => {
  return request.post(`/web/excelImport/batchDelivery`, params, config)
}

// 导出订单
export const getOrdersExcel = params => {
  return request.post(`/web/order/getOrdersExcel`,params, { responseType: 'blob' })
}

// 获取物流信息
export const downloadBatchDeliveryXls = params => {
  return request.get(`/web/excelImport/downloadBatchDeliveryXls`, { params: params })
}

// 下载批量导入模板文件URL
export const getBatchDeliveryXlsUrl = params => {
  return request.get(`/web/excelImport/getBatchDeliveryXlsUrl`, { params: params })
}
