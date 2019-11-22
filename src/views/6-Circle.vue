<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
export default {
  name: 'Circle',
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

    const program = createProgram(gl, VSHADER_RESOURCE, FSHADER_RESOUCE)
    gl.useProgram(program)

    // 获取圆顶点信息
    const vertices = new Float32Array(this.createCircleVertex(0.0, 0.0, 0.5, 5))

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const FSIZE = vertices.BYTES_PER_ELEMENT

    const a_Position = gl.getAttribLocation(program, 'a_Position')
    const a_Color = gl.getAttribLocation(program, 'a_Color')
    // 将缓冲区对象分配给a_Position, 位置信息占两个元素
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
    gl.enableVertexAttribArray(a_Position)
    // 将缓冲区对象分配给a_PositSize, 颜色占三个元素, 偏移量2
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
    gl.enableVertexAttribArray(a_Color)

    // 绘制圆
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 5)
  },
  methods: {
    /**
     * 生成圆的顶点数组
     * @param {Float} x 圆心x坐标
     * @param {Float} y 圆心y坐标
     * @param {Float} radius 半径
     * @param {Number} n 组成三角形数量
     */
    createCircleVertex (x, y, radius, n) {
      let positions = [x, y, 1.0, 1.0, 0.0]
      for (let i = 0; i <= n; i++) {
        let angle = (i * Math.PI * 2) / n
        positions.push(
          x + radius * Math.cos(angle),
          y + radius * Math.sin(angle),
          1.0, // 颜色
          0.0,
          0.0
        )
      }
      return positions
    }
  }
}
</script>
