<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
import Matrix4 from '@/utils/matrix'

export default {
  name: 'Cube',
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // 顶点着色器
    const VSHADER_RESOURCE = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_MvpMatrix;
      varying vec4 v_Color;
      void main () {
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color; 
      }
    `
    // 片元着色器
    const FSHADER_RESOUCE = `
      precision mediump float; 
      varying vec4 v_Color;
      void main () {
        gl_FragColor = v_Color;
      }
    `

    const program = createProgram(gl, VSHADER_RESOURCE, FSHADER_RESOUCE)
    gl.useProgram(program)

    this.program = program
    this.gl = gl

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // 开启隐藏面消除(离视野近的图形会遮挡后面的图形)
    gl.enable(gl.DEPTH_TEST)

    const vertexCount = this.initVertexBuffers()

    const mvpMatrix = new Matrix4()
    // 透视投影
    mvpMatrix.setPerspective(30, 1, 1, 100)
    // 视点, 观察目标点, 正方向
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
    // 传递模型视图投影矩阵
    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    // 使用0-255来表示顶点的每个颜色, 节省空间
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0)
  },
  methods: {
    // 初始化顶点缓冲区
    initVertexBuffers () {
      const verticesColors = new Float32Array([
        // Vertex coordinates and color
        1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
       -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
       -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
        1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
        1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
        1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
       -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
       -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
      ])
      const indices = new Uint8Array([ // 正方体面包括的三角形的六个点的index
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
      ])
      const vertexBuffer = this.gl.createBuffer()
      const indexBuffer = this.gl.createBuffer()

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesColors, this.gl.STATIC_DRAW)

      const FSIZE = verticesColors.BYTES_PER_ELEMENT
      const a_Position = this.gl.getAttribLocation(this.program, 'a_Position')
      this.gl.vertexAttribPointer(a_Position, 3, this.gl.FLOAT, false, FSIZE * 6, 0)
      this.gl.enableVertexAttribArray(a_Position)

      const a_Color = this.gl.getAttribLocation(this.program, 'a_Color')
      this.gl.vertexAttribPointer(a_Color, 3, this.gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
      this.gl.enableVertexAttribArray(a_Color)
      
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW)

      return indices.length
    }
  }
}
</script>
