/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import { history } from 'umi'
import { keyToCamelcase } from './utils'

const handleUrl = url => {
  if (!url) {
    return url
  }
  return encodeURI(decodeURI(`https:${url.replace(/https?:/, '')}`))
}

export const bridges = {
  sendPageData: {
    method: 'sendPageData',
  },
  uploadImage: {
    method: 'uploadImage',
    callbackName: 'getNativeImg',
    patchFn: () =>
      window.getNativeImg([
        {
          fileId: '487986911231152128',
          // 身份证正面
          // filePath:'http://secure.maihaoche.com/47F844D2-C4E0-4805-B36E-86FC6F6E52D9.jpg',
          // avatarPath: 'https://img.maihaoche.com/kunkka/assets/front.jpg',
          // 身份证背面
          filePath:
            'http://secure.maihaoche.com/46FBBEEA-37D4-4C0D-B603-79FC5983E2B9.jpg?e=1594611102&token=BzDkpyEeUNKVhvJn5spXnnwzQXYBnS034DXkbP3U:olfeVZIN3r02-0sTmYRUahX5Hlc=',
          avatarPath:
            'http://secure.maihaoche.com/CBD4061D-B55E-4DBB-A16E-AC0C95514B00.jpg?e=1594610850&token=BzDkpyEeUNKVhvJn5spXnnwzQXYBnS034DXkbP3U:OpxbvQAPkkB1bPh4Y92io0I3Rpc=',
        },
      ]),
  },
  bankDeposit: {
    method: 'bankDeposit',
    callbackName: 'getBankDeposit',
    patchFn: callbackName => {
      setTimeout(() => {
        window[callbackName]({
          bankId: 135,
          bankName: '测试银行',
        })
      })
    },
  },
  bankArea: {
    method: 'bankArea',
    callbackName: 'getBankArea',
    patchFn: callbackName => {
      setTimeout(() => {
        window[callbackName]({
          province: '北京市',
          city: '北京市',
        })
      })
    },
  },
  branchName: {
    method: 'branchName',
    callbackName: 'getBranchName',
    patchFn: callbackName => {
      setTimeout(() => {
        window[callbackName]({
          branchBankName: '测试',
        })
      })
    },
  },
  companyAuth: {
    schema: 'mhcsp://b.maihaoche.com/params?type=companyAuth',
  },
  closeWebView: {
    method: 'closeWebView',
    patchFn: () => {
      window.close()
    },
  },
  openPhotoView: {
    beforeCall(params) {
      const { current, urls } = params
      return {
        current: handleUrl(current),
        urls: (urls || []).map(url => handleUrl(url)),
      }
    },
    patchFn: (_, { current }) => window.open(current),
  },
  openWebview: {
    method: 'openH5WithData',
    callbackName: ({ url, callbackName }) => {
      if (/activity\/trunkLine\/newOrder/.test(url)) {
        return 'transportOrderReport'
      }
      if (/paymentCenter/.test(url)) {
        return 'unionPayCallback'
      }
      if (/carCenter\/wmsUnitePaySettle/.test(url)) {
        return 'wmsSettlePayCallback'
      }
      return callbackName || ''
    },
    patchFn: (callbackName, { url }) => {
      if (/activity\/trunkLine\/newOrder[^#]*$/.test(url)) {
        window[callbackName]({
          success: true,
          data: true,
          isSameWarehouseDeal: false,
          isThreeTransport: true,
        })
      } else {
        window.open(url)
        setTimeout(() => {
          console.log('openWebview setTimeout')
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          window[callbackName] && window[callbackName]({})
        }, 1000)
      }
    },
  },
  selectColor: {
    schema: params =>
      `mhcsp://b.maihaoche.com/params?type=selectColor&value=${params.standardId ||
        '0'},${params.seriesId || '0'}`,
    callbackName: 'selectColor',
    response: keyToCamelcase,
    patchFn: () => {
      setTimeout(() => {
        window.selectColor({
          innerColor_id: '5339',
          innerColor_name: '黑色',
          outerColor_id: '5337',
          outerColor_name: '红色',
        })
      })
    },
  },
  selectModel: {
    schema: 'mhcsp://b.maihaoche.com/params?type=selectModel',
    callbackName: 'selectModel',
    response: keyToCamelcase,
    patchFn: () => {
      setTimeout(() => {
        window.selectModel({
          guide_price: '17.7万',
          model_name: '高尔夫 2014款 1.4L 自动时尚型',
          standard_id: 2,
          standard_name: '国产',
          model_id: '50514',
          series_id: 427,
          series_name: '高尔夫',
          brand_id: 30,
          brand_name: '大众',
        })
      }, 1000)
    },
  },
  setRightMenu: {
    beforeCall: params => ({
      btnColor: '#666666',
      ...params,
      functionName: bridges.setRightMenu.callbackName,
    }),
    callbackName: 'setRightMenu',
    patchFn: () => {
      document.body.addEventListener('keyup', event => {
        // 按键B触发模拟点击
        if (event.keyCode !== 66) {
          return
        }
        window[bridges.setRightMenu.callbackName]()
      })
    },
  },

  // sp 特有， 关闭当前webview 并跳转订单管理页
  goOrderManage: {
    method: 'goOrderManage',
    callbackName: 'goOrderManage',
    patchFn: () => {
      history.replace('/orderManage')
    },
  },
}

const setupWebViewJavascriptBridge = callback => {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge)
  } else if (window.WVJBCallbacks) {
    window.WVJBCallbacks.push(callback)
  } else {
    window.WVJBCallbacks = [callback]
    const WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(() => {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
}

export const isMhcApp = () => {
  const u = navigator.userAgent || ''
  return /maihaoche/.test(u)
}

export const isAndroid = () => {
  const u = navigator.userAgent || ''
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
}

export const isUIWebView = () => {
  const u = navigator.userAgent || ''
  return /UIWebView/.test(u)
}

export const stringifyParams = params => {
  let msgObjStr
  try {
    msgObjStr = JSON.stringify(params)
  } catch (e) {
    msgObjStr = ''
  }
  return msgObjStr
}

export default class NativeBridge {
  static bridge

  static CallAndroidMethhod(method, params) {
    const msgObjStr = stringifyParams(params)
    if (window.MhcJsBridge[method]) {
      try {
        if (typeof params !== 'boolean' && !params) {
          window.MhcJsBridge[method]()
        } else {
          window.MhcJsBridge[method](msgObjStr)
        }
      } catch (e) {
        throw TypeError(e)
      }
    } else {
      console.log(`Android 调用函数不存在 ${method}`)
    }
  }

  static init() {
    if (isUIWebView()) {
      setupWebViewJavascriptBridge(bridge => {
        this.bridge = bridge
        bridge.registerHandler('jsHandler', data => {
          const { params = {}, method_name: methodName } = data
          if (methodName && window[methodName]) {
            window[methodName](params)
          }
        })
      })
    }

    Object.keys(bridges).forEach(key => {
      this[key] = (params, cb) => {
        if (typeof params === 'function') {
          cb = params
          params = null
        }
        const conf = bridges[key]
        let callbackName
        if (conf.callbackName) {
          callbackName = conf.callbackName
          if (typeof callbackName === 'function') {
            callbackName = callbackName(params)
          }
          if (callbackName) {
            window[callbackName] = data => {
              if (!conf.keepAlive) {
                delete window[callbackName]
              }
              if (cb) {
                if (conf.response && typeof conf.response === 'function') {
                  data = conf.response(data)
                }
                cb(data)
              }
            }
          }
        }
        if (conf.beforeCall) {
          params = conf.beforeCall(params)
        }
        this.MhcNativeCall({
          method: conf.method || key,
          params,
          patchFn: conf.patchFn && conf.patchFn.bind(this, callbackName),
          schema: conf.schema,
          cb,
        })
      }
    })
  }

  static CallOldIOS(method, params) {
    const nativeParams = {
      method,
      params,
    }
    if (this.bridge) {
      this.bridge.callHandler('nativeCallback', nativeParams)
    } else {
      console.log('未找到bridge信息')
    }
  }

  static CallIOS(method, params) {
    const msgObjStr = stringifyParams(params)
    try {
      window.webkit.messageHandlers[method].postMessage(msgObjStr)
    } catch (e) {
      console.log(`iOS 调用函数失败 ${method}`, e.message)
    }
  }

  static MhcNativeCall({ method, params, patchFn, schema, cb }) {
    if (!isMhcApp()) {
      if (patchFn && Object.prototype.toString.call(patchFn)) {
        patchFn(params, cb)
      } else {
        console.log('请在卖好车app中打开')
      }
    } else if (schema) {
      let url
      if (typeof schema === 'function') {
        url = schema(params)
      } else {
        url = schema
      }
      window.location.href = url
    } else if (isAndroid()) {
      this.CallAndroidMethhod(method, params)
    } else if (isUIWebView()) {
      this.CallOldIOS(method, params)
    } else {
      this.CallIOS(method, params)
    }
  }

  // link 这个值如果带了 ? & 等，需要 encodeURIComponent 。titile 和 message 也需要。客户端会解析的
  static NativeShare(opt) {
    const keys = ['link', 'title', 'message', 'thumb']
    const baseUrl = 'mhcsp://b.maihaoche.com/params?type=shareWeb'
    if (isMhcApp()) {
      const url = keys
        .filter(k => opt[k])
        .map(k => ({ key: k, value: opt[k] }))
        .map(i => {
          if (i.key === 'link') return { ...i, key: 'value' }
          return i
        })
        .reduce((pre, i) => `${pre}&${i.key}=${i.value}`, baseUrl)
      window.location.href = url
    }
  }
}
