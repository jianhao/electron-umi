import { defineConfig } from 'umi'
import postcssPx2vw from 'postcss-px-to-viewport'
import routes from './config/routes'
import theme from './config/theme'

export default defineConfig({
  proxy: {
    '/api': {
      // target: 'https://faw-pre.maihaoche.com',
      target: 'https://faw-liberate-o.maihaoche.net',
      changeOrigin: true,
    },
  },
  routes,
  nodeModulesTransform: {
    type: 'none',
  },
  dva: {
    hmr: true,
  },
  extraPostCSSPlugins: [
    postcssPx2vw({
      viewportWidth: 750,
      unitPrecision: 5,
      viewportUnit: 'vw',
      minPixelValue: 1,
    }),
  ],
})
