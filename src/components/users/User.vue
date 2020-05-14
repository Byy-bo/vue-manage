<template>
 <div>
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="10">
                <div class="grid-content bg-purple">
                   <el-input v-model="usersObj.query" clearable @clear="getUsers"  placeholder="请输入内容" class="input-with-select">
                        <el-button @click="getUsers" slot="append" icon="el-icon-search"></el-button>
                   </el-input>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 这里是我的用户列表数据 -->
        <el-table :data="tableData" border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
                <template #default="userZt">
                    <div>
                        <el-switch @change="userSwitch(userZt.row)" v-model="userZt.row.mg_state"></el-switch>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="userCz">
                    <el-button type="primary" @click="xgUser(userCz.row)" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" @click="removeUser(userCz.row)" icon="el-icon-delete" size="mini"></el-button>
                    <el-tooltip content="分配角色" placement="top" :enterable="false">
                        <el-button @click="fpUser(userCz.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="usersObj.pagenum" :page-sizes="[1, 2, 3, 4, 5, 6]" :page-size="usersObj.pagesize"
                       layout="total, sizes, prev, pager, next, jumper" :total="userTotal">
        </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="userClose(1)">
        <el-form :model="addForm" :rules="AddRules" ref="AddRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
             <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="addForm.password"></el-input>
            </el-form-item>
             <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
             <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="getAddUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="dialogVisibleXg" width="50%" @close="userClose(2)">
        <el-form :model="upDateForm" :rules="AddRules" ref="updateRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="upDateForm.username" disabled></el-input>
            </el-form-item>
             <el-form-item label="邮箱" prop="email">
                <el-input v-model="upDateForm.email"></el-input>
            </el-form-item>
             <el-form-item label="手机号" prop="mobile">
                <el-input v-model="upDateForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleXg = false">取 消</el-button>
            <el-button type="primary" @click="getUpdatedUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 管理角色对话框 -->
     <el-dialog title="分配角色" :visible.sync="dialogVisiblefp" width="50%" @close="userClose(3)">
        <el-form :model="fpForm" ref="fpRuleForm" label-width="90px" class="demo-ruleForm">
            <p>当前用户：<span>{{ fpForm.username }}</span></p>
            <p class="fp_role">当前角色：<span>{{ fpForm.role_name }}</span></p>
            <el-form-item id="el-form-item" label="分配新角色">
                <el-select v-model="fpForm.roleAc" placeholder="请选择活动区域">
                <el-option v-for="item in roleList" :label="item.roleName" :value="item.id" :key="item.id"></el-option>
            </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisiblefp = false">取 消</el-button>
            <el-button type="primary" @click="fpRole">确 定</el-button>
        </span>
    </el-dialog>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
      const validateEmail = (rule, value, callback) => {
        // 定义我的匹配邮箱的正则表达式
        const emailReg = /^[1-9]\d{7,10}@qq\.com$/
        if (emailReg.test(value)) {
            return callback()
        }
        // 匹配错误返回错误信息
        callback(new Error('这不是一个合法的邮箱'))
      }
      const validatemMobile = (rule, value, callback) => {
        // 定义我的匹配邮箱的正则表达式
        const mobileReg = /^1[35678][0-9]{9}$/
        if (mobileReg.test(value)) {
            return callback()
        }
        // 匹配错误返回错误信息
        callback(new Error('这不是一个合法的手机号'))
      }
   return {
       tableData: [],
       usersObj: {
         query: '',
         pagenum: 1,
         pagesize: 2
       },
       userTotal: 0,
       dialogVisible: false,
       dialogVisibleXg: false,
       dialogVisiblefp: false,
       roleList: [],
       addForm: {
           username: '',
           password: '',
           email: '',
           mobile: ''
       },
       upDateForm: {
           id: '',
           username: '',
           email: '',
           mobile: ''
       },
       fpForm: {
           username: '',
           role_name: '',
           roleAc: '',
           userId: '',
           eamil: '',
           mobile: ''
       },
       AddRules: {
           username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: validatemMobile, trigger: 'blur' }
          ]
       }
   }
  },
  created() {
      this.getUsers()
      this.getRole()
  },
  methods: {
    // 请求获取我的用户列表数据
    async getUsers() {
        const { data: res } = await this.$axios.get('users', {
            params: this.usersObj
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 成功的操作
        this.tableData = res.data.users
        this.userTotal = res.data.total
    },
    // 请求角色
    async getRole() {
        const { data: res } = await this.$axios.get('roles')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 成功的操作
        this.roleList = res.data
    },
    // 操作分页
    handleSizeChange(newPagesize) {
        // console.log(newPagenum)
        this.usersObj.pagesize = newPagesize
        this.getUsers()
    },
    handleCurrentChange(newPagenum) {
        // console.log(newPagesize)
        this.usersObj.pagenum = newPagenum
        this.getUsers()
    },
    // 添加用户
    getAddUser() {
        // 先判断表单验证是否全部通过
        this.$refs.AddRuleForm.validate(async valid => {
            if (!valid) return this.$message.error('请输入正确的信息')
            const { data : res } = await this.$axios.post('users', this.addForm)
            // console.log(res)
            if (res.meta.status !== 201) return this.$message.error('添加用户失败，请稍后再试')
            this.$message({
                    message: '添加用户成功',
                    type: 'success'
                })
            // 重新渲染数据
            this.getUsers()
            // 关闭模态框
            this.dialogVisible = false
        })
    },
    // 关闭模态框重置我的状态
    userClose(num) {
        if (num === 1) {
            this.$refs.AddRuleForm.resetFields()
        } else if (num === 2) {
            this.$refs.updateRuleForm.resetFields()
        } else if (num === 3) {
            this.fpForm = {
                username: '',
                role_name: '',
                roleAc: '',
                userId: '',
                eamil: '',
                mobile: ''
            }
        }
    },
    // 更新用户状态
    async userSwitch(userData) {
        // console.log(userData)
        const { data: res } = await this.$axios.put(`users/${userData.id}/state/${userData.mg_state}`)
        // console.log(res)
         if (res.meta.status !== 200) return this.$message.error('更新用户状态失败')
         this.$message({
                    message: '更新用户状态成功',
                    type: 'success'
                })
         // 重新渲染数据
         this.getUsers()
    },
    // 删除用户
    async removeUser(userData) {
        const confirm = await this.$confirm.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log(confirm)
        if (confirm === 'confirm') {
            const { data: res } = await this.$axios.delete(`users/${userData.id}`)
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message({
                    message: '删除成功',
                    type: 'success'
                })
            this.usersObj.pagenum = Math.ceil((this.userTotal - 1) / this.usersObj.pagesize)
            // 重新渲染数据
            this.getUsers()
        } else {
            this.$message('已取消删除')
        }
    },
    // 修改用户
    async xgUser(userData) {
        const { data: res } = await this.$axios.get(`users/${userData.id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 存我的id
        this.upDateForm.id = res.data.id
        // 显示对应的信息
        this.upDateForm.username = res.data.username
        this.upDateForm.email = res.data.email
        this.upDateForm.mobile = res.data.mobile
        // 打开模态框
        this.dialogVisibleXg = true
    },
    // 修改请求
    getUpdatedUser() {
        // 先判断表单验证是否全部通过
        this.$refs.updateRuleForm.validate(async valid => {
            if (!valid) return this.$message.error('请输入正确的信息')
            const { data : res } = await this.$axios.put(`users/${this.upDateForm.id}`, {
                email: this.upDateForm.email,
                mobile: this.upDateForm.mobile
            })
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error('更新用户失败，请稍后再试')
            this.$message({
                    message: '更新用户成功',
                    type: 'success'
                })
            // console.log(this.addForm)
            // 重新渲染数据
            this.getUsers()
            // 关闭模态框
            this.dialogVisibleXg = false
        })
    },
    // 分配角色
    fpUser(userData) {
        // 渲染信息
        this.fpForm.username = userData.username
        this.fpForm.role_name = userData.role_name
        this.fpForm.email = userData.email
        this.fpForm.mobile = userData.mobile
        this.fpForm.userId = userData.id
        // 打开对话框
        this.dialogVisiblefp = true
    },
    // 分配角色请求
    async fpRole() {
        if (!this.fpForm.roleAc) return this.$message.error('请选择正确的角色')
        console.log(this.fpForm.userId)
        console.log(this.fpForm.roleAc)
        const { data: res } = await this.$axios.put(`users/${this.fpForm.userId}/role`, {
            rid: this.fpForm.roleAc
        })
        console.log(res)
         if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message({
                    message: '更新角色成功',
                    type: 'success'
                })
            // 重新渲染数据
            this.getUsers()
            // 关闭模态框
            this.dialogVisiblefp = false
    }
  },
  components: {
  }
 }
</script>

<style lang="less" scoped>
    .el-table{
        margin: 20px 0;
        font-size: 12px;
    }
    .fp_role{
        margin: 20px 0;
    }
    #el-form-item{
        label{
            &.el-form-item__label{
                text-align: left;
            }
        }
    }
</style>
