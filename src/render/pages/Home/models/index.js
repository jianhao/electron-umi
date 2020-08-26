import { Toast } from 'antd-mobile'
import { getCustomerInfo, queryCustomer, queryOrderCustomer } from '@/services/index'

export default {
  namespace: 'customerManage',
  state: {
    customerInfo: {}, // 客户信息
    customerList: [], // 客户列表
    customerDetail: {}, // 客户详情
    customerOrder: {}, // 客户订单信息
    hasMore: true, // 还有更多列表数据
  },
  effects: {
    // 获取客户信息
    *getCustomerInfo({ payload }, { call, put }) {
      try {
        const { data } = yield call(getCustomerInfo, payload)
        yield put({
          type: 'setData',
          payload: { customerInfo: data },
        })
      } catch (error) {
        console.log('获取失败', error)
      }
    },
    // 获取客户列表
    *queryCustomer({ payload }, { call, put, select }) {
      const state = yield select(store => store.customerManage)
      const params = {
        partnerName: null, // 经销商名称
        invitStatus: null, // 0：邀请中 1：已邀请
        pageSize: 10, // 每页条数
        pageNo: 1, // 第几页
        ...payload,
      }
      if (params.pageNo !== 1) {
        Toast.loading('加载更多...')
      }
      const { data } = params.orderStatus
        ? yield call(queryOrderCustomer, params)
        : yield call(queryCustomer, params)
      const { pages, records, current } = data || {}
      const hasMore = pages > current
      const newList = current === 1 ? records : [...state.customerList, ...records]
      yield put({
        type: 'setData',
        payload: { hasMore, customerList: newList },
      })
      Toast.hide()
    },
  },
  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
