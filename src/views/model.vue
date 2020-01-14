<template>
  <div class="container" ref="container">
  </div>
</template>

<script>
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import OrbitControls from 'three-orbitcontrols'
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
    }
  },
  computed: {},
  created () {},
  mounted () {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, this.$refs.container.offsetWidth / this.$refs.container.offsetHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(this.$refs.container.offsetWidth, this.$refs.container.offsetHeight)
    this.$refs.container.appendChild(renderer.domElement)

    var controls = new OrbitControls(camera, renderer.domElement)

    camera.position.set(0, 20, 100)
    controls.update()

    const animate = () => {
      requestAnimationFrame(animate)

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update()

      renderer.render(scene, camera)
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const img = document.createElement('img')
    // img.src = '/models/test.png'
    // img.onload = e => {
    //   console.log(e)
    // }
    var texture = new THREE.TextureLoader().load('/models/t.png')
    const material = new THREE.MeshBasicMaterial({ map: texture })
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5

    const loader = new STLLoader()
    loader.load('/models/LowerJawScan.stl', (geometry) => {
      geometry = new THREE.Geometry().fromBufferGeometry(geometry)
      // 创建纹理
      // var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      var texture = new THREE.TextureLoader().load('/models/t.png')
      this.assignUVs(geometry)
      // texture.repeat.set(0.001, 0.001)
      var mat = new THREE.MeshBasicMaterial({ map: texture })
      var mesh = new THREE.Mesh(geometry, mat)
      mesh.rotation.x = -0.5 * Math.PI // 将模型摆正
      mesh.scale.set(0.1, 0.1, 0.1) // 缩放
      geometry.center() // 居中显示
      scene.add(mesh)
    })
    renderer.render(scene, camera)
    // const animate = function () {
    //   requestAnimationFrame(animate)
    // }
    animate()
  },
  methods: {
    assignUVs (geometry) {
      geometry.computeBoundingBox()
      const max = geometry.boundingBox.max
      const min = geometry.boundingBox.min
      var offset = new THREE.Vector2(0 - min.x, 0 - min.y)
      var range = new THREE.Vector2(max.x - min.x, max.y - min.y)
      var faces = geometry.faces

      geometry.faceVertexUvs[0] = []

      for (var i = 0; i < faces.length; i++) {
        const v1 = geometry.vertices[faces[i].a]
        const v2 = geometry.vertices[faces[i].b]
        const v3 = geometry.vertices[faces[i].c]
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
          new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
          new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
        ])
      }
      geometry.uvsNeedUpdate = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  width: 500px;
  height: 500px;
  background: #ccc;
}
</style>
