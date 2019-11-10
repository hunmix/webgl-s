import Vue from 'vue'
import Router from 'vue-router'

const requireContext = require.context('./views/', true, /\.vue$/)

const generateRoutes = requireContext => {
  return requireContext.keys().map(key => {
    const name = key.replace(/(.*\/)*([^.]+).*/ig, '$2')
    const component = requireContext(key)
    if (name === 'template') {
      return null
    }
    return {
      path: `/${name}`,
      name,
      component: component.default
    }
  }).filter(v => v)
}

export const routes = generateRoutes(requireContext)

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...routes
  ]
})
