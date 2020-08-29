import { login } from '@/services/index'
import { getQueryString } from './utils/utils'

window.routerBase = '/kunkka/'

// 配置 dva 创建时的参数 , 参见：https://dvajs.com/api/#app-dva-opts，可以捕获 effects 和 subscriptions 中的错误
export const dva = {
  config: {
    onError(err) {
      err.preventDefault() // 阻止 error 的继续抛出？目前看是这样，不知是不是 dva 封装了 err 的方法
    },
  },
}

export async function render(oldRender) {
  const sessionId = getQueryString('sessionId')
  await login({ sessionId })
  oldRender()
}
