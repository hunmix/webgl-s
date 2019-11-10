<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
export default {
  name: 'ColoredPoints',
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
      attribute vec4 a_Color;
      varying vec4 v_Color;
      void main () {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        v_Color = a_Color;
      }
    `
    // 片元着色器
    const FSHADER_RESOUCE = `
      precision mediump float; // 设置浮点数精度
      varying vec4 v_Color;
      void main () {
        gl_FragColor = v_Color;
      }
    `
    // 创建着色器程序
    const program = createProgram(gl, VSHADER_RESOURCE, FSHADER_RESOUCE)
    gl.useProgram(program)

    // 顶点数据
    const verticesSize = new Float32Array([
      0.0, 0.3, 1.0, 0.0, 0.0,
      -0.3, -0.3, 0.0, 1.0, 0.0,
      0.3, -0.3, 0.0, 0.0, 1.0
    ])

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesSize, gl.STATIC_DRAW)

    const FSIZE = verticesSize.BYTES_PER_ELEMENT

    const a_Position = gl.getAttribLocation(program, 'a_Position')
    const a_Color = gl.getAttribLocation(program, 'a_Color')
    // 将缓冲区对象分配给a_Position, 字节数为3, 偏移量0
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
    gl.enableVertexAttribArray(a_Position)
    // 将缓冲区对象分配给a_PositSize, 字节数为3, 偏移量2, 即最后一个字段
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
    gl.enableVertexAttribArray(a_Color)

    gl.drawArrays(gl.POINTS, 0, verticesSize.length / 5)
  },
  methods: {
  }
}
</script>
