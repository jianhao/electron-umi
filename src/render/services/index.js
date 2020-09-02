import request from '@/utils/request'

// 查询首页客户信息
export const getCustomerInfo = data =>
  request.post('/api/gw/v1/tranSport/companyInfo.json', { data })
