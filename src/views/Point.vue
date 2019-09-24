<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { initShaders } from '@/utils'
export default {
  name: 'Point',
  data () {
    return {
    }
  },
  mounted () {
    const canvas = this.$refs.canvas
    const gl = canvas.getContext('webgl') // 获取webgl上下文

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT) // 清空颜色

    const VSHADER_SOURCE = ` // 定义顶点着色器
      void main () {
        gl_Position = vec4(0.0, 0.0, 0.0, 1);
        gl_PointSize = 10.0;
      }
    `
    const FSHADER_SOURCE = ` // 定义片元着色器
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) // 初始化着色器
    gl.drawArrays(gl.POINTS, 0, 1) // 绘制一个点
  },
  methods: {
  }
}
</script>
