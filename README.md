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
│      cuon-matrix.js          // 矩阵类, 向量类
│      webglHelper.js          // webGL初始化辅助函数
│      index.js                // 入口
│      
└─views
        Point.vue              // 页面, 每个页面会在header生成一个跳转到对应页面的按钮
        ...
        template.vue           // 页面模板, 方便复制用- -
```