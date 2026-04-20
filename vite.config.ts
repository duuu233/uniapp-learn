import fs from 'node:fs'
import path from 'node:path'

import Uni from '@dcloudio/vite-plugin-uni'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import dayjs from 'dayjs'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import ViteRestart from 'vite-plugin-restart'

import { copyNativeRes } from './vite-plugins/copyNativeRes'
import { generateComponentTypes } from './vite-plugins/generateComponentTypes'

const subPackageCandidates = [
  'src/pages-home',
  'src/pages-message',
  'src/pages-user',
  'src/pages-work',
  'src/pages-sub',
]

export default ({ mode }) => {
  const { UNI_PLATFORM } = process.env
  const subPackageDirs = subPackageCandidates.filter((dir) =>
    fs.existsSync(path.resolve(process.cwd(), dir)),
  )

  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))
  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_DELETE_CONSOLE,
    VITE_SHOW_SOURCEMAP,
    VITE_APP_PROXY,
    VITE_APP_PROXY_PREFIX,
    VITE_USE_MOCK,
  } = env

  const define = UNI_PLATFORM === 'h5' && mode === 'production' ? createDynamicDefine(env) : {}

  return defineConfig({
    envDir: './env',
    plugins: [
      generateComponentTypes(),
      UniPages({
        exclude: ['**/components/**/**.*'],
        routeBlockLang: 'json5',
        subPackages: subPackageDirs,
        dts: 'src/types/uni-pages.d.ts',
      }),
      UniLayouts(),
      UniPlatform(),
      UniManifest(),
      Uni(),
      {
        name: 'fix-vite-plugin-vue',
        configResolved(config) {
          const plugin = config.plugins.find((item) => item.name === 'vite:vue')
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false
          }
        },
      },
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'uni-app'],
        dts: 'src/types/auto-import.d.ts',
        dirs: ['src/hooks'],
        eslintrc: { enabled: true },
        vueTemplate: true,
      }),
      ViteRestart({
        restart: ['vite.config.js'],
      }),
      UNI_PLATFORM === 'h5' && {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace('%BUILD_TIME%', dayjs().format('YYYY-MM-DD HH:mm:ss'))
        },
      },
      UNI_PLATFORM === 'h5' &&
        mode === 'production' &&
        visualizer({
          filename: './node_modules/.cache/visualizer/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      UNI_PLATFORM === 'app' && copyNativeRes(),
      viteMockServe({
        mockPath: './mock',
        enable: mode === 'development' && JSON.parse(VITE_USE_MOCK),
      }),
      UNI_PLATFORM === 'h5' && mode === 'production' && createEnvConfigPlugin(),
    ],
    define: {
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY),
      ...define,
    },
    css: {
      postcss: {
        plugins: [],
      },
    },
    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
        '@img': path.join(process.cwd(), './src/static/images'),
      },
    },
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      proxy: JSON.parse(VITE_APP_PROXY)
        ? {
            [VITE_APP_PROXY_PREFIX]: {
              target: VITE_SERVER_BASEURL,
              changeOrigin: true,
              rewrite: (requestPath) =>
                requestPath.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), ''),
            },
          }
        : undefined,
    },
    build: {
      sourcemap: VITE_SHOW_SOURCEMAP === 'true',
      target: 'es6',
      minify: mode === 'development' ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: VITE_DELETE_CONSOLE === 'true',
          drop_debugger: true,
        },
      },
    },
  })
}

function createDynamicDefine(envVars) {
  return Object.keys(envVars).reduce((acc, key) => {
    if (key.startsWith('VITE_')) {
      acc[`import.meta.env.${key}`] = `window.__APP_CONFIG__.${key}`
    }
    return acc
  }, {})
}

function createEnvConfigPlugin() {
  let mode = 'production'
  let envDir = process.cwd()

  return {
    name: 'dynamic-env',
    config(config, { mode: configMode }) {
      mode = configMode || 'production'
      envDir = config.envDir || envDir
    },
    async writeBundle(options) {
      const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))
      delete env.VITE_ROOT_DIR

      const configContent = `window.__APP_CONFIG__ = ${JSON.stringify(env)};`
      const outputDir = options.dir || path.resolve(envDir, 'dist')
      const configPath = path.join(outputDir, 'app.config.js')
      fs.writeFileSync(configPath, configContent, 'utf-8')

      const indexPath = path.join(outputDir, 'index.html')
      if (!fs.existsSync(indexPath)) {
        return
      }

      let html = fs.readFileSync(indexPath, 'utf-8')
      let prefix = env.VITE_APP_PUBLIC_BASE || '/'
      if (prefix.endsWith('/')) {
        prefix = prefix.slice(0, -1)
      }

      const scriptTag = `<script src="${prefix}/app.config.js"></script>`
      if (!html.includes('app.config.js')) {
        html = html.replace('</title>', `</title> \n ${scriptTag}`)
        fs.writeFileSync(indexPath, html, 'utf-8')
      }
    },
  }
}
