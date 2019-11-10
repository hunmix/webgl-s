# webgl-s

### 目录结构

```
│  App.vue                     // 页面入口文件
│  index.scss                  // 全局css
│  main.js                     // 程序入口文件
│  mixin.js                    // 公共混入方法(暂时没用到)
│  router.js                   // 路由
│
├─utils
│      index.js                // 工具入口文件
│      webglHelper.js          // webGL辅助函数
│
└─views
        1-Point.vue            // 页面, 每个页面会在header生成一个跳转到对应页面的按钮
        2-ClickPoints.vue
        3-MultiPotint.vue
        4-Rect.vue
        5-ColoredPoints.vue
        6-Circle.vue
        7-Ring.vue
        ...   
        template.vue           // 页面模板, 方便复制用- -
```

[demo预览](http://www.wanglulu.store)