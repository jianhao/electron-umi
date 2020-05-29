import routes from './routes';

export default {
  treeShaking: true,
  publicPath: './', // script、link等资源引入路径
  routes,
  chainWebpack:(config) => { config.target('electron-renderer');},
  plugins: [
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'thresh',
      dll: true,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}
