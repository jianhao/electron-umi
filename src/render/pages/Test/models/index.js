import { getCustomerInfo } from '@/services/index'

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
