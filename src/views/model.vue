<template>
  <div class="container" ref="container">
    <!-- <div class="canvas" ref="container"></div> -->
    <div class="op">
      <button @click="addCube">规则物体贴图</button>
      <button @click="addCube2">不规则物体贴图</button>
      <button @click="addCube3">牙齿模型</button>
    </div>
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
      scene: null,
      camera: null
    }
  },
  computed: {},
  created () {},
  mounted () {
    const scene = new THREE.Scene()
    this.scene = scene
    const camera = new THREE.PerspectiveCamera(75, this.$refs.container.offsetWidth / this.$refs.container.offsetHeight, 0.1, 1000)
    this.camera = camera
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

    // this.addCube()
    // const geometry = new THREE.BoxGeometry(8, 8, 8)
    // var texture = new THREE.TextureLoader().load('/model/texture.jpg')
    // const material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })
    // // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // const cube = new THREE.Mesh(geometry, material)
    // cube.color = 0xffffff
    // scene.add(cube)

    camera.position.z = 5

    this.addStlSplit()
    // const loader = new STLLoader()
    // loader.load('/model/model1.stl', (geometry) => {
    //   geometry = new THREE.Geometry().fromBufferGeometry(geometry)
    //   // 创建纹理
    //   // var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    //   var texture = new THREE.TextureLoader().load('/model/texture.jpg')
    //   this.assignUVs(geometry)
    //   // texture.repeat.set(0.001, 0.001)
    //   var mat = new THREE.MeshBasicMaterial({ map: texture })
    //   var mesh = new THREE.Mesh(geometry, mat)
    //   mesh.rotation.x = -0.5 * Math.PI // 将模型摆正
    //   mesh.scale.set(0.1, 0.1, 0.1) // 缩放
    //   geometry.center() // 居中显示
    //   scene.add(mesh)
    // })
    renderer.render(scene, camera)
    animate()
  },
  methods: {
    addCube () {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0])
      }
      const loader = new STLLoader()
      loader.load('/models/cube.stl', (geometry) => {
        geometry = new THREE.Geometry().fromBufferGeometry(geometry)
        // 创建纹理
        // var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        var texture = new THREE.TextureLoader().load('/models/texture.jpg')
        this.assignUVs(geometry)
        // texture.repeat.set(0.001, 0.001)
        var mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })
        var mesh = new THREE.Mesh(geometry, mat)
        mesh.rotation.x = -0.5 * Math.PI // 将模型摆正
        mesh.rotation.z = -0.5 * Math.PI // 将模型摆正
        this.scene.add(mesh)
      })
    },
    addCube2 () {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0])
      }
      const loader = new STLLoader()
      loader.load('/models/left.stl', (geometry) => {
        geometry = new THREE.Geometry().fromBufferGeometry(geometry)
        // 创建纹理
        // var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        var texture = new THREE.TextureLoader().load('/models/texture2.jpg')
        this.assignUVs(geometry)
        // texture.repeat.set(0.001, 0.001)
        var mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })
        var mesh = new THREE.Mesh(geometry, mat)
        mesh.rotation.x = -0.5 * Math.PI // 将模型摆正
        mesh.rotation.z = -0.5 * Math.PI // 将模型摆正
        this.scene.add(mesh)
      })
      loader.load('/models/right.stl', (geometry) => {
        geometry = new THREE.Geometry().fromBufferGeometry(geometry)
        // 创建纹理
        // var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        var texture = new THREE.TextureLoader().load('/models/texture3.jpg')
        this.assignUVs(geometry)
        // texture.repeat.set(0.001, 0.001)
        var mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })
        var mesh = new THREE.Mesh(geometry, mat)
        mesh.rotation.x = -0.5 * Math.PI // 将模型摆正
        mesh.rotation.z = -0.5 * Math.PI // 将模型摆正
        this.scene.add(mesh)
      })
      loader.load('/models/right2.stl', (geometry) => {
        geometry = new THREE.Geometry().fromBufferGeometry(geometry)
        var texture = new THREE.TextureLoader().load('/models/texture.jpg')
        this.assignUVs(geometry)
        var mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })
        var mesh = new THREE.Mesh(geometry, mat)
        mesh.rotation.x = -0.5 * Math.PI
        mesh.rotation.z = -0.5 * Math.PI
        this.scene.add(mesh)
      })
    },
    addCube3 () {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0])
      }
      const loader = new STLLoader()
      loader.load('/models/model1.stl', (geometry) => {
        // geometry = new THREE.Geometry().fromBufferGeometry(geometry)
        console.log('done')
        // 创建纹理
        var mat = new THREE.MeshBasicMaterial({ color: 0x0000ff })
        var mesh = new THREE.Mesh(geometry, mat)
        mesh.rotation.x = -0.5 * Math.PI // 将模型摆正
        mesh.rotation.z = -0.5 * Math.PI // 将模型摆正
        this.scene.add(mesh)
        console.log()
      })
      loader.load('/model/model2.stl', (geometry) => {
        // geometry = new THREE.Geometry().fromBufferGeometry(geometry)
        // 创建纹理
        var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        var mesh = new THREE.Mesh(geometry, mat)
        mesh.rotation.x = -0.5 * Math.PI // 将模型摆正
        mesh.rotation.z = -0.5 * Math.PI // 将模型摆正
        this.scene.add(mesh)
      })
    },
    addStlSplit () {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0])
      }
      const loader = new STLLoader()
      loader.load('/models/split.stl', (geometry) => {
        console.log(geometry)
        geometry = new THREE.Geometry().fromBufferGeometry(geometry)
        // 创建纹理
        // var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        var texture = new THREE.TextureLoader().load('/models/texture2.jpg')
        this.assignUVs(geometry)
        // texture.repeat.set(0.001, 0.001)
        var mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })
        var mesh = new THREE.Mesh(geometry, mat)
        mesh.rotation.x = -0.5 * Math.PI // 将模型摆正
        mesh.rotation.z = -0.5 * Math.PI // 将模型摆正
        this.scene.add(mesh)
      })
    },
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
  position: relative;
  width: 600px;
  height: 600px;
  background: #ccc;
  .canvas{
    width: 100%;
    height: 100%;
  }
  .op{
    position: absolute;
  }
}
</style>
