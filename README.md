# vue-tiptop-editor
Rich text editor based on vue3, Typescript and tiptop
It is currently in the development stage and cannot be used directly

基于vue3，Typescript，tiptop开发的富文本编辑器
目前处于开发阶段，还不可以直接使用


# 安装
```
pnpm install vue-tiptop-editor

```

# 使用
```
<!-- vite-env.d.ts -->

declare module 'vue-tiptop-editor'

```

在需要的地方
```
import VueTiptopEditor from "vue-tiptop-editor"
<VueTiptopEditor v-model="value"></VueTiptopEditor>

```
