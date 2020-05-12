<template>
  <div class="login_content">
    <div class="login_box">
      <div class="login_tx">
        <img src="../assets/img/logo.ef36589d.png" alt />
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginRuleForm" class>
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getLogin">登录</el-button>
          <el-button @click="restLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击登录
    getLogin() {
        this.$refs.loginRuleForm.validate(async bool => {
            // 校验失败
            if (!bool) return false
            // 校验成功
            const { data } = await this.$axios.post('login', this.loginForm)
            // console.log(data)
            if (data.meta.status !== 200) {
                this.$message.error(data.meta.msg)
            } else {
                // 提示登录成功
                this.$message({
                    message: data.meta.msg,
                    type: 'success'
                })
                // 记录我token
                window.sessionStorage.setItem('token', data.data.token)
                // 跳转首页
                this.$router.push('/home')
            }
        })
    },
    restLogin() {
        // 拿到我对应的表单
        this.$refs.loginRuleForm.resetFields()
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.login_content {
  position: relative;
  width: 100%;
  height: 100%;
  background: #2b4b6b;
  .login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 3px;
    .login_tx {
      position: absolute;
      width: 130px;
      height: 130px;
      border: 1px solid #eeeeee;
      padding: 10px;
      background: #ffffff;
      box-shadow: 0 0 10px #dddddd;
      border-radius: 50%;
      left: 50%;
      top: -50%;
      margin-left: -76px;
      margin-top: 76px;
      img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
      }
    }
    .el-form{
        width: 90%;
        margin: 100px auto 0;
        .el-form-item{
            text-align: center;
            &.is-success{
                .el-input__inner{
                    border: 1px solid greenyellow !important;
                }
            }
        }
    }
  }
}
</style>
