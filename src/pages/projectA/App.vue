<template>
  <div id="app">
    <p><i class="el-icon-share"></i>one</p>
    <img class="poster" src="/static/public/poster.jpg">
    <router-view/>
  </div>
</template>

<script>
import Logo from '@/assets/logo.png'
import api from '@/api/projectA'

export default {
  name: 'App',
  data () {
    return {
      logo: Logo
    }
  },
  mounted () {
    this.$get(api.test).then((res) => {
      
    }).catch((mes) => {

    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
