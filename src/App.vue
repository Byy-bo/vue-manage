<template>
  <div id="app">
    <div id="nav">
      <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      <el-button icon="el-icon-search" circle></el-button>
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
      <el-button type="success" icon="el-icon-check" circle></el-button>
      <el-button type="info" icon="el-icon-message" circle></el-button>
      <el-button type="warning" icon="el-icon-star-off" circle></el-button>
      <el-button type="danger" icon="el-icon-delete" circle></el-button>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      value: true
    }
  },
  components: {}
}
</script>

<style scoped>
</style>
