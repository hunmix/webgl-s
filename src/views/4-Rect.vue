<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
export default {
  name: 'Rect',
  data () {
    return {
      points: [],
      program: null,
      gl: null
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

    const program = createProgram(gl, VSHADER_RESOURCE, FSHADER_RESOUCE)
    gl.useProgram(program)

    const vertices = new Float32Array([
      -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    // 创建缓冲区
    const vertexBuffer = gl.createBuffer()
    // 将缓冲区对象绑定到目标, ARRAY_BUFFER(表示缓冲区对象中包含了顶点数据)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 向缓冲区中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    // 向缓冲区中写入数据
    const a_Position = gl.getAttribLocation(program, 'a_Position')
    // 将缓冲区对象分配给a_Position
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    // 连接a_Position和缓冲区对象
    gl.enableVertexAttribArray(a_Position)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2)
  },
  methods: {
  }
}
</script>
