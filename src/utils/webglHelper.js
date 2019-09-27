/**
 * 创建着色器程序
 * @param {Object} gl webgl上下文
 * @param {String} vShaderSource 顶点着色器源码
 * @param {String} fShaderSource 片元着色器源码
 */
export function createProgram (gl, vShaderSource, fShaderSource) {
  // 获取着色器对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vShaderSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fShaderSource)

  // 创建程序对象
  const program = gl.createProgram()

  // 挂载着色器对象到程序上
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  
  //链接着色器程序
  gl.linkProgram(program)

  // 检查是否连接成功
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    const error = gl.getProgramInfoLog(program)
    console.log('Failed to link program: ' + error)
    gl.deleteProgram(program)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)
    return null
  }
  return program
} 
/**
 * 加载着色器
 * @param {Object} gl webgl上下文
 * @param {Number} type 着色器类型: webgl常量, one of [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER]
 * @param {String} source 着色器源码
 */
function loadShader(gl, type, source) {
  // 创建着色器对象
  const shader = gl.createShader(type)
  if (shader == null) {
    console.log('unable to create shader')
    return null
  }

  // 将着色器源码绑定到着色器对象上
  gl.shaderSource(shader, source)

  // 编译着色器对象
  gl.compileShader(shader)

  // 检测是否绑定成功
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader)
    console.log('Failed to compile shader: ' + error)
    gl.deleteShader(shader)
    return null
  }

  return shader
}
