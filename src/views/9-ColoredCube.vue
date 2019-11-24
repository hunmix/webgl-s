<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
import Matrix4 from '@/utils/matrix'
export default {
  name: 'ColoredCube',
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
      attribute vec4 a_Position; // 点坐标
      attribute vec4 a_Color; // 点颜色
      uniform mat4 u_MvpMatrix; // 变换矩阵
      varying vec4 v_Color; // 给片元着色器的颜色
      void main () {
        gl_Position = u_MvpMatrix * a_Position; // 计算变化后的点位置
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

    // 开启隐藏面消除(离视野近的图形会遮挡后面的图形)
    gl.enable(gl.DEPTH_TEST)
    const vertexCount = this.initVertexBuffers()

    const mvpMatrix = new Matrix4()
    mvpMatrix.setPerspective(30, 1, 1, 100) // 透视投影
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0) // 视点, 观察目标点, 正方向
    // 传递模型视图投影矩阵
    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0)
  },
  methods: {
    // 初始化顶点
    initVertexBuffers () {
      // Create a cube
      //    v6----- v5
      //   /|      /|
      //  v1------v0|
      //  | |     | |
      //  | |v7---|-|v4
      //  |/      |/
      //  v2------v3
      const vertices = new Float32Array([
        // Vertex coordinates and color
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
       -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
       -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
      ])
      const colors = new Float32Array([
        0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
        0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
        1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
        1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
        0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
      ])
      const indices = new Uint8Array([ // 正方体面包括的三角形的六个点的index
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
      ])
      this.initArrayBuffer(vertices, 3, this.gl.FLOAT, 'a_Position')
      this.initArrayBuffer(colors, 3, this.gl.FLOAT, 'a_Color')

      const indexBuffer = this.gl.createBuffer()
      
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW)

      return indices.length
    },
    // 初始化缓冲区
    initArrayBuffer (data, num, type, attribute) {
      const buffer = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW)

      const a_attribute = this.gl.getAttribLocation(this.program, attribute)
      this.gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)
      this.gl.enableVertexAttribArray(a_attribute)
    }
  }
}
</script>
