<template>
  <div>
    <div class="container" ref="container">
      <!-- <div class="canvas" ref="container"></div> -->
    </div>
    <div class="op">
      <button @click="play">{{isPause ? 'start' : 'pause' }}</button>
    </div>
    <div class="progress">
      <div
        :class="{step: true, step__active: activeStep === i - 1}"
        v-for="i of STEPS + 1"
        :key="i"
        @click="changeProgress(i - 1)"
      >
        {{i - 1}}
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'dat.gui'

export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      scene: null,
      camera: null,
      items: [], // 所有可选中物体
      rayCaster: null,
      mouse: null,
      animationObjects: [],
      isPause: true,
      STEPS: 12, // 总步数
      STEP_LEN: 0.5, // 步长
      GUI: null,
      unselectableItems: [],
      activeStep: 0 // 当前播放帧
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.initGUI()

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const scene = new THREE.Scene()
    this.scene = scene
    const axisHelper = new THREE.AxisHelper(500)
    this.scene.add(axisHelper)

    const camera = new THREE.PerspectiveCamera(75, this.$refs.container.offsetWidth / this.$refs.container.offsetHeight, 0.1, 1000)
    this.camera = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(this.$refs.container.offsetWidth, this.$refs.container.offsetHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0xeeeeee)
    renderer.shadowMap.enabled = true
    this.$refs.container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    camera.position.set(0, 60, 100)
    controls.update()

    scene.background = new THREE.Color(0x5e5e5e)
    const ambientLight = new THREE.AmbientLight(0xa2a2a2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xf0e8e8, 0.3)
    directionalLight.castShadow = true
    directionalLight.position.set(0, 20, 50)
    scene.add(directionalLight)
    const directionalLight2 = new THREE.DirectionalLight(0xf0e8e8, 0.3)
    directionalLight2.castShadow = true
    directionalLight2.position.set(-50, 20, 0)
    // scene.add(directionalLight2)
    const directionalLight3 = new THREE.DirectionalLight(0xf0e8e8, 0.3)
    directionalLight3.castShadow = true
    directionalLight3.position.set(50, 20, 0)
    // scene.add(directionalLight3)
    const dirHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
    scene.add(dirHelper)
    // const dirHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 5)
    // scene.add(dirHelper2)
    // const dirHelper3 = new THREE.DirectionalLightHelper(directionalLight3, 5)
    // scene.add(dirHelper3)

    // controls.addEventListener('change', () => {
    //   // console.log('changed')
    //   // console.log(camera.position)
    //   directionalLight.position.copy(camera.position)
    // })
    // camera.add(directionalLight)
    // var pointLight = new THREE.PointLight(0xff0000, 1, 50)
    // pointLight.position.set(0, 40, 40)
    // pointLight.castShadow = true
    // scene.add(pointLight)

    // var sphereSize = 1
    // var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize)
    // scene.add(pointLightHelper)

    // var spotLight = new THREE.SpotLight(0xffffff, 0.2)
    // spotLight.position.set(0, 20, 40)
    // scene.add(spotLight)

    // var spotLightHelper = new THREE.SpotLightHelper(spotLight)
    // scene.add(spotLightHelper)

    const animate = () => {
      requestAnimationFrame(animate)

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update()
      ambientLight.color.setHex(this.GUI.ambientLightColor)
      directionalLight.position.x = this.GUI.dirLightX
      directionalLight.position.y = this.GUI.dirLightY
      directionalLight.position.z = this.GUI.dirLightZ
      directionalLight.color.setHex(this.GUI.dirLightColor)
      directionalLight.intensity = this.GUI.dirLightStrength
      this.unselectableItems.forEach(mesh => {
        mesh.material.color.set(this.GUI.gumColor)
        mesh.material.emissive.set(this.GUI.gumEmissive)
        mesh.material.specular.set(this.GUI.gumSpecular)
        mesh.material.shininess = this.GUI.gumShininess
        mesh.material.flatShading = this.GUI.gumFlatShading
      })
      renderer.render(scene, camera)
      // if (!this.isPause) {
      this.animationObjects.forEach(mesh => {
        mesh.material.color.set(this.GUI.toothColor)
        mesh.material.emissive.set(this.GUI.toothEmissive)
        mesh.material.specular.set(this.GUI.toothSpecular)
        mesh.material.shininess = this.GUI.toothShininess
        mesh.material.flatShading = this.GUI.toothFlatShading
        this.activeStep = Math.floor(mesh.userData.action.time / this.STEP_LEN)
        if (mesh.userData.clock && mesh.userData.mixer) {
          mesh.userData.mixer.update(mesh.userData.clock.getDelta())
        }
      })
      // }
    }

    camera.position.z = 5

    this.addCube3()
    // this.plane()

    const onMouseMove = (event) => {
      var rect = this.$refs.container.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / (rect.width)) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      // calculate objects intersecting the picking ray
      var intersects = raycaster.intersectObjects(this.items)
      if (intersects[0]) {
        intersects[0].object.material.color.set(0x495EDB)
        console.log(intersects[0].object.name)
      }
    }
    window.addEventListener('click', onMouseMove, false)
    renderer.render(scene, camera)
    animate()
  },
  methods: {
    initGUI () {
      const gui = new dat.GUI()
      this.GUI = {
        // scene
        dirLightX: 0,
        dirLightY: 20,
        dirLightZ: 50,
        dirLightColor: 0xf0e8e8,
        dirLightStrength: 0.3,
        ambientLightColor: 0xa2a2a2,
        // tooth
        toothColor: 0xeeeeee,
        toothEmissive: 0x000000,
        toothShininess: 80,
        toothSpecular: 0x919191,
        toothFlatShading: false,
        // gum
        gumColor: 0xb64a52,
        gumEmissive: 0x000000,
        gumShininess: 30,
        gumSpecular: 0x281e1e,
        gumFlatShading: false
      }
      const scene = gui.addFolder('scene and light')
      scene.add(this.GUI, 'dirLightX', -200, 200)
      scene.add(this.GUI, 'dirLightY', -200, 200)
      scene.add(this.GUI, 'dirLightZ', -200, 200)
      scene.add(this.GUI, 'dirLightStrength', 0, 3)
      scene.addColor(this.GUI, 'dirLightColor')
      scene.addColor(this.GUI, 'ambientLightColor')
      const tooth = gui.addFolder('toothMaterial')
      tooth.addColor(this.GUI, 'toothColor')
      tooth.addColor(this.GUI, 'toothEmissive')
      tooth.addColor(this.GUI, 'toothSpecular')
      tooth.add(this.GUI, 'toothShininess', 0, 100)
      tooth.add(this.GUI, 'toothFlatShading')
      const gum = gui.addFolder('gumMaterial')
      gum.addColor(this.GUI, 'gumColor')
      gum.addColor(this.GUI, 'gumEmissive')
      gum.addColor(this.GUI, 'gumSpecular')
      gum.add(this.GUI, 'gumShininess', 0, 100)
      gum.add(this.GUI, 'gumFlatShading')
    },
    changeProgress (index) {
      if (this.isPause) {
        this.animationObjects.forEach(mesh => {
          mesh.userData.action.time = index * this.STEP_LEN
          mesh.userData.clip.duration = index * this.STEP_LEN
          this.activeStep = index
          mesh.userData.action.play()
        })
      } else {
        this.animationObjects.forEach(mesh => {
          mesh.userData.action.time = index * this.STEP_LEN
          mesh.userData.clip.duration = this.STEPS * this.STEP_LEN
          this.activeStep = index
          mesh.userData.action.play()
        })
      }
    },
    play () {
      if (this.activeStep === this.STEPS && this.isPause) {
        this.animationObjects.forEach(mesh => {
          // mesh.userData.action.time = 0
          mesh.userData.clip.duration = this.STEPS * this.STEP_LEN
          mesh.userData.action.reset()
          this.isPause = false
        })
        return
      }
      this.animationObjects.forEach(mesh => {
        if (mesh.userData.clock && mesh.userData.mixer) {
          if (!this.isPause) {
            mesh.userData.action.paused = true
          } else {
            mesh.userData.clip.duration = this.STEPS * this.STEP_LEN
            mesh.userData.action.paused = false
          }
        }
      })
      this.isPause = !this.isPause
    },
    async addCube3 () {
      const loader = new STLLoader()
      loader.load('/model/gum.stl', geometry => {
        // const material = new THREE.MeshLambertMaterial({ color: 0xE7909A, shininess: 100, emissive: 0xafa1a1 })
        // geometry = new THREE.Geometry().fromBufferGeometry(geometry)
        // geometry.mergeVertices()
        geometry.computeVertexNormals()
        const material = new THREE.MeshPhongMaterial({
          color: 0x892b32,
          shininess: 30,
          emissive: 0x000000,
          specular: 0x3e2020,
          shading: THREE.SmoothShading
        })
        const mesh = new THREE.Mesh(geometry, material)
        // mesh.material.flatShading = false
        mesh.castShadow = mesh.receiveShadow = true
        this.scene.add(mesh)
        this.unselectableItems.push(mesh)
      })
      const load = () => {
        return new Promise((resolve, reject) => {
          let islands2 = []
          loader.load('/model/tooth2.stl', (geometry) => {
            islands2 = this.seperateObject(geometry)
            resolve(islands2)
          })
        })
      }
      const islands2 = await load()
      loader.load('/model/tooth.stl', (geometry) => {
        const islands = this.seperateObject(geometry)
        for (let i = 0; i < islands.length; i++) {
          const geometry = new THREE.BufferGeometry()
          // const morphTargets = geometry.morphTargets
          // if (morphTargets !== undefined && morphTargets.length > 0) {
          //   geometry.morphTargetInfluences = []
          //   geometry.morphTargetDictionary = {}
          //   for (let m = 0, ml = morphTargets.length; m < ml; m++) {
          //     geometry.morphTargetInfluences.push(0)
          //     geometry.morphTargetDictionary[ morphTargets[ m ].name ] = m
          //   }
          // }
          // geometry.morphAttributes.position[0] = tooth2[i]
          // console.log(geometry.morphTargetInfluences)
          const vertices = new Float32Array(islands[i].positions)
          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
          geometry.morphAttributes.position = []
          geometry.morphAttributes.position[0] = new THREE.BufferAttribute(new Float32Array(islands2[i].positions), 3)
          // geometry = new THREE.Geometry().fromBufferGeometry(geometry)
          // geometry.mergeVertices()
          geometry.computeVertexNormals()
          // 这里也可以初始化的时候扔进去
          // geometry.computeVertexNormals()
          // geometry.morphTargets = []
          // geometry.morphTargets.push(0)
          // geometry.morphTargetInfluences = [0]
          // console.log(geometry)
          // geometry.morphTargets = [{
          //   name: 'tooth' + i,
          //   // vertices: tooth2[i]
          //   vertices: new Float32Array(islands2[i].positions)
          // }]
          const material = new THREE.MeshPhongMaterial({
            color: 0xeeeeee,
            // emissive: 0x5e5959,
            morphTargets: true,
            shininess: 50,
            specular: 0x919191,
            flatShading: false
          })
          material.flatShading = false
          const mesh = new THREE.Mesh(geometry, material)
          mesh.castShadow = mesh.receiveShadow = true
          mesh.name = 'tooth' + i
          this.addItems(mesh)
          this.scene.add(mesh)
          // mesh.morphTargetInfluences = [0]
          const mixer = new THREE.AnimationMixer(mesh)
          const times = []
          const values = []
          // 计算每个阶段的morphTargetInfluences值, 均分
          const step = Math.floor(10000 / (this.STEPS)) / 10000
          // 共STEPS + 1个阶段, 第一个为初始阶段(牙齿初始模型)
          for (let i = 0; i <= this.STEPS; i++) {
            times.push(i * this.STEP_LEN)
            values.push(i * step)
          }
          const keyFrame = new THREE.NumberKeyframeTrack('geometry.morphTargetInfluences', times, values, THREE.InterpolateDiscrete)
          const animationClip = new THREE.AnimationClip('wavelineMorphTargetsClip', this.STEPS * this.STEP_LEN, [keyFrame]).optimize()
          // 不自动开启动画
          this.isPause = true
          animationClip.duration = 0
          // const animationClip = new THREE.AnimationClip.CreateFromMorphTargetSequence('run', mesh.geometry.morphTargets, 30)
          // console.log(animationClip)
          const animationAction = mixer.clipAction(animationClip)
          animationAction.setLoop(THREE.LoopOnce)
          mixer.addEventListener('finished', e => {
            this.isPause = true
          })
          // animationAction.setLoop(THREE.LoopRepeat)
          animationAction.clampWhenFinished = true
          animationAction.play()
          mesh.userData.clock = new THREE.Clock()
          mesh.userData.mixer = mixer
          mesh.userData.action = animationAction
          mesh.userData.clip = animationClip
          this.animationObjects.push(mesh)
        }
      })
    },
    plane () {
      const planeGeo = new THREE.PlaneGeometry(100, 100, 10, 10)
      const planeMat = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        wireframe: false
      })
      const planeMesh = new THREE.Mesh(planeGeo, planeMat)
      planeMesh.position.set(0, -20, 0)
      planeMesh.rotation.x = -0.5 * Math.PI
      planeMesh.receiveShadow = true
      this.scene.add(planeMesh)
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
    },
    addItems (item) {
      this.items.push(item)
    },
    seperateObject (geometry) {
      const points = geometry.attributes.position.array
      // const normals = geometry.attributes.normal.array
      const islands = []
      let matches
      for (let i = 0; i < points.length; i = i + 9) {
        matches = []
        const triangle = []
        const positions = []
        for (let j = i; j < i + 9; j = j + 3) {
          const point = []
          for (let h = j; h < j + 3; h++) {
            point.push(points[h])
            positions.push(points[h])
          }
          triangle.push(point)
          for (let k = 0; k < islands.length; k++) {
            if (matches.indexOf(k) === -1 && islands[k].visited.has(point.join(':'))) {
              matches.push(k)
            }
          }
        }
        matches.sort((x, y) => (x < y ? -1 : (x > y ? 1 : 0)))
        let island
        if (matches.length <= 0) {
          island = { visited: new Map(), positions: [] }
          islands.push(island)
        } else {
          island = islands[matches[0]]
          // 判断island是否有相连的, 有的话合并
          for (var j = matches.length - 1; j >= 1; j--) {
            // other island
            const mm = islands[matches[j]]
            for (var key in mm.points) {
              if (mm.points.hasOwnProperty(key)) {
                island.points[key] = true
              }
            }
            island.positions.push(...mm.positions)
            islands.splice(matches[j], 1)
          }
        }

        for (let i = 0; i < 3; i++) {
          island.visited.set(triangle[i].join(':'), true)
        }
        island.positions.push(...positions)
      }
      return islands
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
    margin: 4px 0;
  }
  .progress{
    display: flex;
    margin: 4px 0;
    .step{
      width: 50px;
      height: auto;
      margin: 0 1px;
      background: #eee;
      text-align: center;
      cursor: pointer;
    }
    .step__active{
      background: #ccc;
    }
  }
}
</style>
