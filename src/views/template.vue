<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>
import { createProgram } from '@/utils'
export default {
  name: 'Name',
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
    `
    // 片元着色器
    const FSHADER_RESOUCE = `
    `

    const program = createProgram(gl, VSHADER_RESOURCE, FSHADER_RESOUCE)

    this.program = program
    this.gl = gl
  },
  methods: {
  }
}
</script>
