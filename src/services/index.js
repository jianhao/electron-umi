import request from '@/utils/request'

// 登录
export const login = data => request.post('/api/login.json', { data })

// 查询首页客户信息
export const getCustomerInfo = data =>
  request.post('/api/gw/v1/tranSport/companyInfo.json', { data })

// 客户列表
export const queryCustomer = data => request.post('/api/gw/v1/tranSport/queryList.json', { data })

// 获取有订单的客户
export const queryOrderCustomer = data =>
  request.post('/api/gw/v1/tranSport/queryOrder.json', { data })

// 获取用户信息
export const getUserInfo = data => request.post('/api/v2/center/getUserInfo.json', { data })
