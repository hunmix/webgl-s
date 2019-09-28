<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
// import { createProgram } from '@/utils'
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

    // 创建顶点着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    // 将源码分配给顶点着色器对象
    gl.shaderSource(vertexShader, VSHADER_SOURCE)
    // 编译顶点着色器程序
    gl.compileShader(vertexShader)
    // 创建片元着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    // 将源码分配给片元着色器对象
    gl.shaderSource(fragmentShader, FSHADER_SOURCE)
    // 编译片元着色器程序
    gl.compileShader(fragmentShader)

    // 创建着色器程序
    const program = gl.createProgram()
    // 将顶点着色器挂载在着色器程序上
    gl.attachShader(program, vertexShader)
    // 将片元着色器挂载在着色器程序上
    gl.attachShader(program, fragmentShader)
    // 链接着色器程序
    gl.linkProgram(program)

    // 使用创建好的着色器程序。
    gl.useProgram(program)

    gl.drawArrays(gl.POINTS, 0, 1) // 绘制一个点
  },
  methods: {
  }
}
</script>
