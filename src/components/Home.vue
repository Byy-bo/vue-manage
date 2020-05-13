<template>
 <div class="home_content">
   <el-container>
     <el-header>
         <div class="home_logo"><img src="../assets/img/logo.ef36589d.png" alt=""></div>
         <p>电商后台管理系统</p>
         <el-button type="info" @click="getLoginOut">退出</el-button>
     </el-header>
     <el-container>
       <el-aside :width="isCollapse ? '64px' : '200px' ">
         <div class="toggle_button" @click="toggleButton"> | | | </div>
         <el-menu router unique-opened :default-active="activeIndex" ref="elMenu" @open="upOpen" background-color="#333744" text-color="#fff" active-text-color="#409EFF"
          :collapse="isCollapse" :collapse-transition="false">
           <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
             <template slot="title">
               <i :class="iconsObj[item.id]"></i>
               <span>{{ item.authName }}</span>
             </template>
             <el-menu-item :index="childItem.path" @click="saveIndex(childItem.path, item.authName, childItem.authName)" v-for="childItem in item.children" :key="childItem.id">
                 <i class="el-icon-menu"></i>
                 <span>{{ childItem.authName }}</span>
             </el-menu-item>
           </el-submenu>
         </el-menu>
       </el-aside>
       <el-main>
           <home-breadcrumb v-if="activeIndex" :authName="authName"></home-breadcrumb>
           <router-view />
       </el-main>
     </el-container>
   </el-container>
 </div>
</template>

<script>
// 导入子组件
import homeBreadcrumb from './home/HomeBreadcrumb.vue'
 export default {
  name: 'hoem',
  data () {
   return {
       menus: [],
       iconsObj: {
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao'
      },
      isCollapse: false,
      activeIndex: '',
      authName: {
        itemAuthName: '',
        childAuthName: ''
      },
      indexId: ''
   }
  },
  created () {
      // window.sessionStorage.removeItem('activeIndex')
      this.getHomeList()
      this.homeGet()
  },
  methods: {
      async getHomeList() {
          const { data } = await this.$axios.get('menus')
          // console.log(data)
          if (data.meta.status !== 200) {
              return this.$message.error(data.meta.msg)
          }
          this.menus = data.data
      },
      // 登出
      getLoginOut() {
        // 删除我的本地缓存的token
        window.sessionStorage.clear()
        // 跳转到login页面
        this.$router.push({ path: '/login' })
        // 友好提示
        this.$message('退出系统成功')
      },
      // 折叠菜单
      toggleButton() {
          this.isCollapse = !this.isCollapse
      },
      // 激活我的子菜单,面包屑导航
      saveIndex(index, fName, sName) {
          this.activeIndex = index
          this.authName.itemAuthName = fName
          this.authName.childAuthName = sName
          // 保存在我的本地缓存当中
          window.sessionStorage.setItem('activeIndex', index)
          window.sessionStorage.setItem('itemAuthName', fName)
          window.sessionStorage.setItem('childAuthName', sName)
      },
      homeGet() {
        // 页面刷新的时候获取到我本地的激活状态,面包屑导航
        this.activeIndex = window.sessionStorage.getItem('activeIndex')
        this.authName.itemAuthName = window.sessionStorage.getItem('itemAuthName')
        this.authName.childAuthName = window.sessionStorage.getItem('childAuthName')
      },
      upOpen(key) {
          this.indexId = key + ''
      }
  },
  components: {
      homeBreadcrumb
  },
   watch: {
    $route(to) {
      if (to.path === '/welcome') {
        window.sessionStorage.removeItem('activeIndex')
        window.sessionStorage.removeItem('itemAuthName')
        window.sessionStorage.removeItem('childAuthName')
        this.homeGet()
        this.$refs.elMenu.close(this.indexId)
      }
    }
  }
 }
</script>

<style lang="less" scoped>
    .home_content{
        height: 100%;
        .el-container{
            height: 100%;
          .el-header{
            position: relative;
            padding: 0;
            background: #373d41;
            padding-left: 75px;
            .home_logo{
                position: absolute;
                width: 60px;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                img{
                    width: 100%;
                }
            }
            p{
                color: #ffffff;
                height: 100%;
                line-height: 60px;
                font-size: 20px;
            }
            .el-button{
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
            .el-aside{
                position: relative;
                padding-top: 24px;
                .toggle_button{
                    cursor: pointer;
                    position: absolute;
                    width: calc(100% - 1px);
                    height: 24px;
                    line-height: 24px;
                    color: #ffffff;
                    font-size: 10px;
                    text-align: center;
                    top: 0;
                    left: 0;
                    background: #4A5064;
                }
                .el-menu{
                    height: 100%;
                    overflow: hidden;
                    .el-submenu{
                        i{
                            &.iconfont{
                                margin-right: 5px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
