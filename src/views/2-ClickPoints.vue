<template>
  <canvas ref="canvas" width="400" height="400" @click="clickCanvas" style="width: 400px; height: 400px"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
export default {
  name: 'ClickPoints',
  data () {
    return {
      points: [],
      program: null,
      gl: null,
      a_Position: null
    }
  },
  mounted () {
    const canvas = this.$refs.canvas
    const gl = canvas.getContext('webgl')

    gl.clearColor(0.0, 0.0, 0.0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    // 顶点着色器
    const VSHADER_RESOURCE = `
      attribute vec4 a_Position;
      void main () {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
      }
    `
    // 片元着色器
    const FSHADER_RESOUCE = `
      void main () {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `
    // 创建着色器程序
    const program = createProgram(gl, VSHADER_RESOURCE, FSHADER_RESOUCE)
    // 使用着色器程序
    gl.useProgram(program)

    // 获取a_Position变量索引
    const a_Position = gl.getAttribLocation(program, 'a_Position')

    this.program = program
    this.gl = gl
    this.a_Position = a_Position
  },
  methods: {
    clickCanvas (e) {
      // 计算webgl坐标系点的位置, 并加入点数组
      const target = e.target
      const { width, height } = target
      const canvasX = width / 2
      const canvasY = height / 2
      const rect = target.getBoundingClientRect()
      const { left, top } = rect
      const { clientX, clientY } = e
      const pointX = (clientX - left - canvasX) / canvasX
      const pointY = (canvasY - (clientY - top)) / canvasY
      this.points.push({ x: pointX, y: pointY })
      // 绘制点
      this.drawPoints()
    },
    // 绘制数组中所有的点
    drawPoints () {
      const { gl } = this
      gl.clear(gl.COLOR_BUFFER_BIT) // 清空颜色
      this.points.forEach(point => {
        // 向a_Position传入点坐标
        gl.vertexAttrib3f(this.a_Position, point.x, point.y, 0)
        // 画点
        gl.drawArrays(gl.POINTS, 0, 1)
      })
    }
  }
}
</script>
