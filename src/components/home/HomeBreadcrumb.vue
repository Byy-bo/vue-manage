<template>
 <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ authName.itemAuthName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ authName.childAuthName }}</el-breadcrumb-item>
    </el-breadcrumb>
 </div>
</template>

<script>
 export default {
  name: '',
  props: ['authName'],
  data () {
   return {
   }
  },
  components: {
  }
 }
</script>

<style lang="less" scoped>
    .el-breadcrumb {
        font-size: 12px;
        padding-bottom: 20px;
    }
</style>
