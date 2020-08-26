import { extend } from 'umi-request'
import { Toast } from 'antd-mobile'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

function errorHandler(error) {
  // 请求已发送但服务端返回状态码非 2xx 的响应
  if (error.response) {
    const { status, statusText } = error.response
    const errortext = codeMessage[status] || statusText
    Toast.error(errortext, 2)
    // 请求初始化时出错或者没有响应返回的异常
  } else {
    const msg = error.message || error.errDesc || '系统异常'
    Toast.info(msg, 2)
  }
  throw error
}

// umi request 实例
const request = extend({
  errorHandler,
})

// 响应拦截器
request.interceptors.response.use(async (res, payload) => {
  const { resultCode, success, message, errDesc } = await res.clone().json()
  const msg = message || errDesc || '系统错误'
  const { noThrow } = payload || {}

  if (
    errDesc === '用户不存在' ||
    msg?.includes('登陆失效') ||
    msg?.includes('通过session无法找到用户')
  ) {
    Toast.info(msg)
    window.location.href = 'mhcsp://b.maihaoche.com/params?type=login'
    const err = new Error(msg)
    throw err
  }
  // 业务上错误的简单处理，使用于大多数接口，可以在 config 中传递 noThrow 不走这一层拦截
  if (!(resultCode === '1' || success === true) && !noThrow) {
    Toast.info(msg)
    const err = new Error(msg)
    throw err
  }
  return res
})

export default request
