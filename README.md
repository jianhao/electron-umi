> 基于 umi3 + dva + react + antd-mobile 搭建项目。

## 功能
- [x] umi + dva + react hooks + antd-mobile
- [x] eslint + stylelint + prettierrc
- [x] sass/less
- [x] global 样式 + mixin 样式
- [x] px 自动转 vw
- [x] 资源上传七牛
- [x] 错误统一拦截

## 目录结构介绍

    ├── dist/                           // 默认的 build 输出目录
    ├── mock/                           // mock 文件所在目录，基于 express
    └── config/
        ├── config.js                   // umi 配置，同 .umirc.js，二选一
        ├── routers.js                  // 路由配置
    └── src/
        ├── layouts/index.js            // 全局布局
        ├── assets                      // 静态资源
        ├── components                  // 公共组件
        ├── models                      // 全局 models
        ├── services                    // services
        ├── styles                      // 样式文件
        ├── utils                       // 工具文件
        └── pages/                      // 页面目录
        ├── global.less                 // 自动引入的全局样式
        ├── app.js                      // 运行时配置文件
    ├── gulpfile.js                     // 静态资源上传七牛配置
    ├── .umirc.js                       // umi 配置，同 config/config.js，二选一
    ├── .editorconfig                   // 维护代码风格的配置文件
    ├── .eslintignore                   // eslint 忽略文件
    ├── .eslintrc.js                    // eslint 配置文件
    ├── .gitignore                      // git 要忽略的文件
    ├── .prettierignore                 // Prettier 要忽略的文件
    ├── .prettierrc.js                  // Prettier 代码格式化配置文件 
    ├── .stylelintrc.js                 // css 代码审查的配置文件
    ├── jsconfig.jso                    // js 配置文件
    ├── package.json                    // npm 依赖记录文件
    ├── yarn.lock                       // yarn 版本锁定文件
    ├── eevee.config.js                 // eevee 项目配置
    ├── jenkins-ci                      // jenkins 打包上传 eevee 配置
    └── resourceGenerator.js            // 打包资源上传 eevee 配置
## 搭建步骤

参考： [UmiJs官网](https://umijs.org/zh/guide/getting-started.html#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87)、
[JsConfig.js](https://segmentfault.com/a/1190000018013282?utm_source=tag-newest)、
[JestConfig.js](https://www.jianshu.com/p/ce4f46cd9372)、
[puppeteer](https://juejin.im/post/6844903727447425038)、
[stylelint](https://www.jianshu.com/p/49baebbc1950)、
[Prettier](https://segmentfault.com/a/1190000015315545)、
[Editorconfig](https://juejin.im/post/6844903640595972103)
### 1、使用 umi 创建项目

node版本>=10.13, 推荐nvm管理node版本，yarn管理npm依赖（使用国内源）

```
# 国内源
$ npm i yarn tyarn -g
# 后面文档里的 yarn 换成 tyarn
$ tyarn -v
$ 1.16.0

```
先找个地方建个项目目录并进入
```
$ mkdir myapp && cd myapp
```

创建项目并安装依赖
```
$ yarn create @umijs/umi-app
$ yarn
$ yarn start
```
此时，项目已经启动，通过 http://localhost:8000 访问


### 2、配置 Eslint 规则

umi 维护了一个 prettier，eslint，stylelint 的配置文件合集--[umi-fabric](https://github.com/umijs/fabric)

这里直接添加 .eslintrc.js、.prettierrc.js、.stylelintrc.js ，配置如下：


```
1、.eslintrc.js 配置
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'react/jsx-first-prop-new-line': 'error',
    semi: ['error', 'never'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-plusplus': 'off',
    'react/sort-comp': 'off',
    'no-unused-expressions': 'off',
  },
}

2、.prettierrc.js 配置
const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  semi: false,
}


3、.stylelintrc.js 配置
const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.stylelint,
}

```
你的 vscode 要安装这三个同名扩展插件，这时候分别去更改 js、less 文件，会发现已经有风格校验了，保存会自动修复。

### 3、样式配置

umi3 默认支持 less，如果需要 sass，需要安装 node-sass 依赖，推荐使用 less。

global.less 会默认引入，所以这里可以用来写一些全局样式，src 下建立 styles 目录，添加 base.less 和 mixins.less， base.less 可以作为导出各种变量和 mixin 给其他 less 文件使用的一个出口。

global.less 添加 css reset 和一些样式自定义，如下：

```
@import "~@/styles/base.less";

body, dl, dt, dd, ul, ol, li, pre, form, fieldset, input, p, blockquote, th, td {
  margin:0;
  padding:0;
  font-weight:400;
  font-family:Helvetica,Arial,sans-serif;
  text-align:left;
  background-color:#FFF;
}

html, body, #root {
  height: 100%;
  margin:0;
  padding:0;
  color: @text-color;
  font-size: 28px;
}

p, h1, h2, h3, h4, h5, h6 {
  margin:0;
  padding:0;
}
fieldset, img {
  border:0 none;
}

address, caption, em, strong, th, i {
  font-weight:400;
  font-style:normal;
}

ol, ul {
  list-style-position:outside;
  list-style-type:none;
}

<!--公共样式-->
根据项目添加...
```

### 4、px 转 vw
之所以用 vw 不用当前非常通用的 rem， 是因为 rem 方案有几个缺点：
- rem 不容易理解，字体单位却用来处理长度问题
- 需要 js 设置根元素 font-size，样式和行为耦合不是很好
- rem 设置的 css 长度，经过四合五入，存在最后 1 像素问题

这里借助 [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 帮我们自动转 px 为 vw ，先安装依赖：

```
yarn add postcss-px-to-viewport
```
然后在 umirc.js 中添加配置如下：

```
export default defineConfig({
  extraPostCSSPlugins: [
    postcssPx2vw({
      viewportWidth: 750,
      unitPrecision: 5,
      viewportUnit: 'vw',
      minPixelValue: 1,
    }),
  ],
});
```
这样你发现 css文件中的 px 已经自动转为 vw 了。


### 5、静态资源上传 CDN
有些资源较大可能要上传到 cdn 来使用，我这里使用 gulp 上传资源到七牛来使用，没有图床的同学可以参考我的另一篇文章：[图床搭建](https://juejin.im/post/6844904062626824205)

#### 安装依赖

```
yarn add gulp gulp-qiniu --dev
```


#### 添加配置
根目录新建 qiniuAssets 目录和 gulpfile.js ，配置如下：

```
/* eslint-disable import/no-extraneous-dependencies */
const gulp = require('gulp')
const path = require('path')
const qiniu = require('gulp-qiniu')

// file upload tasks
const imageSrc = path.resolve(__dirname, 'qiniuAssets/*.*')

gulp.task('qiniu', (done) => {
  gulp
    .src(imageSrc)
    .pipe(
      qiniu(
        {
          accessKey: '你的七牛 accessKey',
          secretKey: '你的七牛 secretKey',
          bucket: 'maihaoche',
          private: false,
        },
        {
          dir: 'assets/',
          version: false,
        },
      ),
    )
    .on('finish', done)
})

// combine tasks
gulp.task('upload',gulp.series(['qiniu'], (done) => {
  done()
}))

module.exports = gulp

```

### 添加命令行
在 package.json 中 scripts 中添加一行如下：

```
"upload": "gulp qiniu",
```

将要上传的资源放到 qiniuAssets 目录中，然后执行命令：

```
yarn upload 
```

就可以使用上传后的资源url，如：https://img.XXXX.com/assets/上传的图片名.jpg(png)

### 6、请求异常统一拦截
大多数接口请求，与后台约定统一响应数据结构，统一错误处理，可以简化业务层处理逻辑，只处理正常流即可。

#### 添加 request 配置
此处使用 umi-request、antd-mobile 处理请求，首先添加依赖：

```
yarn add umi-request antd-mobile
```

然后添加 utils/request.js, 内容如下：

```
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
request.interceptors.response.use(async (res, req) => {
  const { resultCode, success, message, errDesc } = await res.clone().json()
  const msg = message || errDesc || '系统错误'
  const { noThrow } = req || {}

  if (errDesc === '用户不存在' || msg?.includes('登陆失效') || msg?.includes('通过session无法找到用户')) {
    Toast.info(msg)
    window.location.href = '/login'
    const err = new Error(msg)
    throw err
  }
  // 业务上错误的简单处理，适用绝大多数接口，可以在 req 的 config 中传递 noThrow 不走这一层拦截
  if (!(resultCode === '1' || success === true) && !noThrow) {
    Toast.info(msg)
    const err = new Error(msg)
    throw err
  }
  return res
})

export default request
```
大部分业务场景都可以这样过滤一层，然后业务中支处理正常流即可。<br/>

#### 异常流的处理方式

这里 dva 提供了一个 onError 的 hook 来全局错误处理，在 src/app.js 中添加 dva 配置：

```
import { login } from '@/services/index'
import { getQueryString } from './utils/utils'

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

```

如果有特殊的接口需要单独处理异常，可以在 models 通过 try catch 捕获错误继续处理，如下：<br/>
```
effects: {
    *getUserInfo({ payload }, { call, put }) {
      try {
        const { data } = yield call(getUserInfo, payload)
        yield put({
          type:'setData',
          payload: { customerInfo: data}
        })
      } catch (error) {
        console.log('获取失败', error)
      }
    },
}
```

或者不通过 models 调用的话，可以在 promise catch 中处理，如下：

```
// 获取客户信息
getUserInfo().then((userInfo) => {
  console.log('获取用户信息成功1', userInfo)
}).catch((err) => {
  console.log('获取用户信息失败1', err)
})

```

还有最坏的情况，后台返回的响应根本没有约定好响应的结构，且拒绝修改，那只能一边骂骂咧咧一边修改代码了，这个接口单独在业务中处理！如下传个标志给 request：

```
import request from '@/utils/request'

// 不走统一拦截的接口，传个 'noThrow' 标志到 request 拦截层
export const login = (data) => request.post('/api/login.json', { data， noThrow: true })
// 统一异常处理的接口
export const getCustomerInfo = (data) => request.post('/api/companyInfo.json', { data })
```

request.js 根据这个标志将这种接口的响应直接返回到前台，自己在业务中单独处理这种接口的异常情况。

#### 总结：
- 大部分接口统一拦截请求异常，只在业务中处理正常流
- 接口在 models 中通过 try catch 单独处理异常后的操作
- 不通过 models 的可以直接在 promise catch中处理异常
- 需要单独处理的可以传个标志给request，不走响应拦截的条件

如此这般一通操作，就可以完整建立一个单页面移动端项目了，happy coding 😸

