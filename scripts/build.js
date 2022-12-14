// const path = require('path')
// const fs = require('fs')
// const { defineConfig, build } = require('vite')
// const vue = require('@vitejs/plugin-vue')
// const vueJsx = require('@vitejs/plugin-vue-jsx')

import path from 'path'
import fs from 'fs/promises'
import { defineConfig, build } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from  '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'


import { fileURLToPath } from 'url'

const __filenameNew = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filenameNew)

const entryDir = path.resolve(__dirname, '../packages/vue-tiptop-editor')
const outputDir = path.resolve(__dirname, '../dist')

const _moduleName = "vue-tiptop-editor"

const _cssDir = path.resolve(__dirname, `../dist/${_moduleName}.js` )

const baseConfig = defineConfig({
    configFile: false,
    publicDir: false,
    plugins:[dts({
        outputDir:"dist",
        staticImport: true,
        insertTypesEntry: true
    }),vue(), vueJsx() ]
})

const rollupOptions = {
    external: ['vue'],
    output:{
        globals: {
            vue: 'Vue'
        }
    }
}

// 全量构建
const buildAll = async () => {
    await build(defineConfig({
        ...baseConfig,
        build:{
            rollupOptions,
            lib: {
                entry: path.resolve(entryDir, 'index.ts'),
                name:_moduleName,
                fileName:_moduleName,
                formats: ['es','umd']
            },
            outDir: outputDir
        }
    }))
}

const buildLib = async () => {
    await buildAll()

    // 将样式文件引入到打包好的入口文件中

    console.log("_cssDir", _cssDir);

    fs.appendFile(_cssDir, "import './style.css'", "utf-8")


}

buildLib()