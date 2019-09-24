<template>
  <canvas ref="canvas" width="400" height="400"></canvas>
</template>

<script>

export default {
  name: 'Name',
  mounted () {
    const canvas = this.$refs.canvas
    const gl = canvas.getContext('webgl')
  }
}
</script>
