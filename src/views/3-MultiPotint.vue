<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
export default {
  name: 'MultiPotint',
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
    // 顶点数组, 两个值表示一个二维点坐标
    const vertices = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])

    const program = createProgram(gl, VSHADER_RESOURCE, FSHADER_RESOUCE)
    gl.useProgram(program)

    // 创建缓冲区对象
    const buffer = gl.createBuffer()
    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // 向缓冲对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    // 获取a_Postion变量
    const a_Position = gl.getAttribLocation(program, 'a_Position')

    const index = a_Position // 索引
    const size = 2 // 占用元素数量
    const type = gl.FLOAT // 元素类型
    const normalized = false // 是否归一化
    const stride = 0 // 一个顶点信息所占用的字节数
    const offset = 0 // 字节偏移量, 单位为字节

    // 将缓冲区对象分配给a_Positiohn变量 
    gl.vertexAttribPointer(index, size, type, normalized, 0, 0)
    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position)

    gl.drawArrays(gl.POINTS, 0, 3)
  },
  methods: {
  }
}
</script>
