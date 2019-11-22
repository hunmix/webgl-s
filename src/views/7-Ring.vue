<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
export default {
  name: 'Ring',
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
    const vertices = new Float32Array(this.createRingVertex(0.0, 0.0, 0.3, 0.7, 30))

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

    // 绘制四边形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 5)
  },
  methods: {
    /**
     * 生成圆的顶点数组
     * @param {Float} x 圆心x坐标
     * @param {Float} y 圆心y坐标
     * @param {Float} innerRadius 内圈半径
     * @param {Float} outerRadius 外圈半径
     * @param {Number} n 组成四边形数量
     */
    createRingVertex (x, y, innerRadius, outerRadius, n) {
      var positions = []
      var color = this.randomColor()
      let pre = [] // 保存上一个条边的信息
      for (var i = 0; i <= n; i++) {
        color = this.randomColor() // 为每个四边形生成一个随机颜色
        const colorArr = [color.r, color.g, color.b]
        var angle = i * Math.PI * 2 / n

        const inner = [x + innerRadius * Math.sin(angle), y + innerRadius * Math.cos(angle), ...colorArr]
        const outer = [x + outerRadius * Math.sin(angle), y + outerRadius * Math.cos(angle), ...colorArr]
        if (pre.length > 0) {
          // 获取上一条边坐标, 组合成为一个四边形, 颜色统一
          positions.push(...pre[0].slice(0, 2), ...colorArr, ...pre[1].slice(0, 2), ...colorArr)
          pre = [inner, outer] // 保存边数据, 供下一个四边形使用
        } else {
          pre = [inner, outer]
        }
        positions.push(...inner)
        positions.push(...outer)
      }
      return positions
    },
    randomColor () {
      return {
        r: Math.random() * 10 / 10,
        g: Math.random() * 10 / 10,
        b: Math.random() * 10 / 10
      }
    }
  }
}
</script>
