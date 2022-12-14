// const path = require('path')
// const fs = require('fs')
// const { defineConfig, build } = require('vite')
// const vue = require('@vitejs/plugin-vue')
// const vueJsx = require('@vitejs/plugin-vue-jsx')

import path from 'path'
import fs from 'fs'
import { defineConfig, build } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from  '@vitejs/plugin-vue-jsx'


import { fileURLToPath } from 'url'

const __filenameNew = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filenameNew)

const entryDir = path.resolve(__dirname, '../packages/vue-tiptop-editor')
const outputDir = path.resolve(__dirname, '../dist')

const baseConfig = defineConfig({
    configFile: false,
    publicDir: false,
    plugins:[vue(), vueJsx()]
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
                name:"vue-tiptop-editor",
                fileName:'vue-tiptop-editor',
                formats: ['es','umd']
            },
            outDir: outputDir
        }
    }))
}

const buildLib = async () => {
    await buildAll()
}

buildLib()