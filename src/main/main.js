/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
// import { creatServer } from '../server/index'
const { app, BrowserWindow } = require('electron')
const { creatServer } = require('../server/index')
// const path = require('path')
// const url = require('url')

const isDev = process.env.NODE_ENV === 'development'
console.log(process.env.NODE_ENV)

function createWindow() {
  let mainWindow = new BrowserWindow({
    // 实例化一个窗口
    width: 1200,
    height: 900,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true, // node 集成，可以使用 require 和 process 这样的node APIs 去访问低层系统资源
    },
  })
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true' // 禁用控制台

  if (isDev) {
    mainWindow.loadURL('http://localhost:9527/')
    mainWindow.webContents.openDevTools()
  } else {
    creatServer()
    mainWindow.loadURL('http://localhost:3009/')
    // mainWindow.loadURL(
    //   url.format({
    //     pathname: path.join(__dirname, './index.html'), // umi 打包的资源路径
    //     protocol: 'file:',
    //     slashes: true,
    //   }),
    // )
    mainWindow.webContents.openDevTools()
  }
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
app.on('ready', createWindow) // 应用初始化后打开窗口
app.on('quit', () => {})
