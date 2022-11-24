module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        // 为了解决vscode的eslint插件关于module报错处理
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    // 解析html标签
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/ban-types": [
            "error",
            {
              "extendDefaults": true,
              "types": {
                "{}": false
              }
            }
          ],
        //  关闭any警告
          "@typescript-eslint/no-explicit-any": ["off"]
    }
}
