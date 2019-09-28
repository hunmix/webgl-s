<template>
  <div class="container">
    <header>
      <router-link class="link" :class="{active: button.path === $route.path}" v-for="button of buttons" :key="button.path" :to="button.path">{{button.path}}</router-link>
    </header>
    <div class="content-wrapper">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { routes } from '@/router'
export default {
  name: 'root',
  data () {
    return {
      buttons: []
    }
  },
  mounted () {
    this.buttons = routes
  }
}
</script>

<style lang="scss">
.container{
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  header{
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    background: #000;
  }
  .content-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 50px 20px 20px 20px;
    width: 100%;
    height: auto;
  }
  .link{
    display: inline-block;
    margin: 5px;
    color: #fff;
  }
  .active{
    color: gold;
  }
}
</style>
