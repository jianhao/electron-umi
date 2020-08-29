import { defineConfig } from 'umi'
import routes from './routes'

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
})
