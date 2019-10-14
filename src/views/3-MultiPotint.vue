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

    const vertices = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])

    const program = createProgram(gl, VSHADER_RESOURCE, FSHADER_RESOUCE)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const a_Position = gl.getAttribLocation(program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.drawArrays(gl.POINTS, 0, 3)
  },
  methods: {
  }
}
</script>
