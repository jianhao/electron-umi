import { Toast } from 'antd-mobile'

/** 获取 window.location.search 中某个 query 字段
 *@param {String} query 的 key
 *@return {String} 获取的 query 的 value
 *@author jianhao
 */
export const getQueryString = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export const toUnderscore = origin =>
  (origin || '')
    .replace(/\.?([A-Z])/g, (x, y) => `_${y.toLowerCase()}`)
    .replace(/^_/, '')
    .toUpperCase()

export const toCamelcase = origin => (origin || '').replace(/_([a-z])/g, (x, y) => y.toUpperCase())

export const toFormatedMobile = origin => (origin || '').replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2')

export const limitDisplayChar = (origin, length = 0) =>
  length ? (origin || '').replace(new RegExp(`^(.{${length}}).+$`), '$1...') : origin

export function keyToCamelcase(obj) {
  // eslint-disable-next-line no-param-reassign
  obj = obj || this
  return Object.keys(obj).reduce(
    (pre, cur) => ({
      ...pre,
      [toCamelcase(cur)]: obj[cur],
    }),
    {},
  )
}

/**
 * 校验keys 的回调，处理多种key 的情况
 * 'a'
 * 'a.c.b'
 * ['a', 'c.b', 'c.d.f']
 */
const validateKeysHandle = (data, key, cb) => {
  if (Array.isArray(key)) {
    return key.every(k => {
      return validateKeysHandle(data, k, cb)
    })
  }
  if (key.includes('.')) {
    let cur = data
    key.split('.').forEach(k => {
      cur = cur?.[k]
    })
    return cb(cur)
  }
  return cb(data?.[key])
}
/**
 * 可以用于表单校验
 * @param {Array} data
 * @param {*} valite
 */
export const validateData = (data, valite) => {
  for (let i = 0; i < valite.length; i++) {
    const item = valite[i]
    // 是否必填
    if (item.required) {
      if (!validateKeysHandle(data, item.key, o => o != null)) {
        Toast.info(item.msg)
        return false
      }
    }
    if (item.arrayLength != null) {
      if (
        !validateKeysHandle(data, item.key, o => {
          if (o && Array.isArray(o)) {
            return o.length >= item.arrayLength
          }
          return false
        })
      ) {
        Toast.info(item.msg)
        return false
      }
    }
    if (item.min != null) {
      if (!validateKeysHandle(data, item.key, o => o >= item.min)) {
        Toast.info(item.msg)
        return false
      }
    }
    if (item.hook) {
      if (!validateKeysHandle(data, item.key, o => item.hook(o))) {
        Toast.info(item.msg)
        return false
      }
    }
    // TODO: 更多可以完善
  }
  return true
}

/**
 * 去除 url 中多余的转义字符
 * @param {String} url
 * @param {*} valite
 */
export const decodeUrl = url => {
  let newUrl = url
  newUrl = newUrl.replace(/&quot;/g, '"')
  newUrl = newUrl.replace(/&amp;/g, '&')
  newUrl = newUrl.replace(/&lt;/g, '<')
  newUrl = newUrl.replace(/&gt;/g, '>')
  newUrl = newUrl.replace(/&nbsp;/g, ' ')
  return newUrl
}

export const getLastString = (str, num) => {
  if (str) {
    return str.slice(-num)
  }
  return ''
}

/** 设置meta */
export const setViewportMeta = () => {
  const metaDom = document.createElement('meta')
  metaDom.name = 'viewport'
  metaDom.content =
    'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
  document.head.appendChild(metaDom)
}

/** 设置 title */
export function changeTitle(title) {
  document.setTitle = t => {
    document.title = t
    const i = document.createElement('iframe')
    i.src = 'https://img.maihaoche.com/ico/favicon.ico'
    i.style.display = 'none'
    i.onload = () => {
      setTimeout(() => {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
  setTimeout(() => {
    document.setTitle(title)
  }, 0)
}
