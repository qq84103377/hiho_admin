import request from '@/utils/request'

// 获取支付流水列表
export const listFinPayment = params => {
  return request.post(`/web/finPayment/listFinPayment`, params)
}