<template>
 <div>
     <el-card>
         <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
         <el-table :data='rolesList' border stripe>
             <el-table-column type="expand">
                 <template #default="roles">
                     <el-row v-for="(itemOne, index) in roles.row.children" :key="itemOne.id" :class="['bo', 'cen', index===0?'to':'']">
                         <el-col :span="5">
                             <el-tag @close="removeQx(roles, itemOne.id)" closable >{{ itemOne.authName }}</el-tag>
                         </el-col>
                         <el-col :span="19">
                             <el-row v-for="(itemTwo, index) in itemOne.children" :key="itemTwo.id" :class="['cen', index===0?'':'to']">
                                 <el-col :span="6">
                                     <el-tag @close="removeQx(roles, itemTwo.id)" closable  type="success">{{ itemTwo.authName }}</el-tag>
                                 </el-col>
                                 <el-col :span="18">
                                     <el-tag @close="removeQx(roles, itemThree.id)" v-for="itemThree in itemTwo.children" :key="itemThree.id" closable type="warning">{{ itemThree.authName }}</el-tag>
                                 </el-col>
                             </el-row>
                         </el-col>
                     </el-row>
                 </template>
             </el-table-column>
             <el-table-column label="#" type="index"></el-table-column>
             <el-table-column label="角色名称" prop="roleName"></el-table-column>
             <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
             <el-table-column label="操作">
                 <template #default="roles">
                    <el-button @click="getRoleXx(roles.row.id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button @click="removeRole(roles.row.id)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    <el-button @click="fpXsRole(roles.row)" type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                 </template>
             </el-table-column>
         </el-table>
     </el-card>

     <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%" @close="roleClose(1)">
        <el-form :model="addForm" :rules="AddRules" ref="AddRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
             <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="getAddRole">确 定</el-button>
        </span>
    </el-dialog>

     <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogVisibleUp" width="50%" @close="roleClose(2)">
        <el-form :model="upDateForm" :rules="AddRules" ref="upDateRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="upDateForm.roleName"></el-input>
            </el-form-item>
             <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="upDateForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleUp = false">取 消</el-button>
            <el-button type="primary" @click="upDateAddRole">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogVisibleFp" width="36%" @close="roleClose(3)">
        <el-tree :data="rightsList" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defaultKeys" :props="defaultProps" ref="treeRoleRights">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleFp = false">取 消</el-button>
            <el-button type="primary" @click="fpRole">确 定</el-button>
        </span>
    </el-dialog>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
       rolesList: [],
       rightsList: [],
       addForm: {
           roleName: '',
           roleDesc: ''
       },
       upDateForm: {
           id: '',
           roleName: '',
           roleDesc: ''
       },
       dialogVisible: false,
       dialogVisibleUp: false,
       dialogVisibleFp: false,
       AddRules: {
           roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ]
       },
       defaultKeys: [],
       defaultProps: {
           label: 'authName',
           children: 'children'
       },
       roleId: ''
   }
  },
  created () {
    this.getRoles()
  },
  methods: {
    //  渲染角色请求
    async getRoles() {
        const { data: res } = await this.$axios.get('roles')
        console.log(res)
         if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 获取成功
        this.rolesList = res.data
    },
    // 删除对应的权限
    async removeQx(roles, riId) {
        const confirm = await this.$confirm.confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)

        if (confirm !== 'confirm') return this.$message.info('取消了删除')
        const { data: res } = await this.$axios.delete(`roles/${roles.row.id}/rights/${riId}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
         this.$message({
             message: '删除成功',
             type: 'success'
         })
        // 更新
         roles.row.children = res.data
    },
    // 添加角色
    getAddRole() {
         // 先判断表单验证是否全部通过
        this.$refs.AddRuleForm.validate(async valid => {
            if (!valid) return this.$message.error('请输入正确的信息')
            const { data : res } = await this.$axios.post('roles', this.addForm)
            // console.log(res)
            if (res.meta.status !== 201) return this.$message.error('添加角色失败，请稍后再试')
            this.$message({
                message: '添加角色成功',
                type: 'success'
            })
            // 重新渲染数据
            this.getRoles()
            // 关闭模态框
            this.dialogVisible = false
        })
    },
    // 监听模态框关闭
    roleClose(num) {
        if (num === 1) {
            this.$refs.AddRuleForm.resetFields()
        } else if (num === 2) {
            this.$refs.upDateRuleForm.resetFields()
        } else if (num === 3) {
            this.defaultKeys = []
        }
    },
    // 删除对应的角色
    async removeRole(id) {
        // 提示消息
        const confirm = await this.$confirm.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirm !== 'confirm') return this.$message.info('取消了删除')
        // 进行删除请求删除数据
        const { data: res } = await this.$axios.delete(`roles/${id}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除角色失败, 请稍后再试')
        this.$message({
            message: '删除角色成功',
            type: 'success'
        })
        // 重新渲染数据
        this.getRoles()
    },
    // 根据id获取到对应的角色渲染我的对话框get
    async getRoleXx(id) {
        const { data: res } = await this.$axios.get(`roles/${id}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.mate.msg)
        // 获取成功赋值渲染
        this.upDateForm = {
           id: res.data.roleId,
           roleName: res.data.roleName,
           roleDesc: res.data.roleDesc
       }
       // 显示对应的对话框
       this.dialogVisibleUp = true
    },
    // 编辑提交角色
    upDateAddRole() {
         // 先判断表单验证是否全部通过
        this.$refs.upDateRuleForm.validate(async valid => {
            if (!valid) return this.$message.error('请输入正确的信息')
            const { data : res } = await this.$axios.put(`roles/${this.upDateForm.id}`, {
                roleName: this.upDateForm.roleName,
                roleDesc: this.upDateForm.roleDesc
            })
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error('编辑角色失败，请稍后再试')
            this.$message({
                message: '编辑角色成功',
                type: 'success'
            })
            // 重新渲染数据
            this.getRoles()
            // 关闭模态框
            this.dialogVisibleUp = false
        })
    },
    // 获取权限列表
    async getRightsList() {
        const { data: res } = await this.$axios.get('rights/tree')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightsList = res.data
    },
    // 显示渲染分配权限对话框
    fpXsRole(roles) {
        // 存储我对应的id
        this.roleId = roles.id
        // 显示对应的对话框
        this.dialogVisibleFp = true
        // 显示权限
        this.getRightsList()
        // 渲染选中的权限
        this.getAcRights(roles)
    },
    // 渲染选中的权限
    getAcRights(roles) {
        // 判断是否是3级列表
        if (!roles.children) return this.defaultKeys.push(roles.id)
        // 不是的话继续执行
        roles.children.forEach(item => this.getAcRights(item))
    },
    // 分配权限请求
    async fpRole() {
        const keys = [...this.$refs.treeRoleRights.getCheckedKeys(), ...this.$refs.treeRoleRights.getHalfCheckedKeys()].join(',')
        // 请求
        const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, {
            rids: keys
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('权限更改失败, 请稍后再试')
        this.$message({
            message: '权限更改成功',
            type: 'success'
        })
        // 重新渲染数据
        this.getRoles()
        // 关闭对话框
        this.dialogVisibleFp = false
    }
  },
  components: {
  }
 }
</script>

<style lang="less" scoped>
    .el-table{
        margin-top: 16px;
        .el-tag{
            margin: 8px;
        }
        .bo{
            border-bottom: 1px solid #eeeeee;
        }
        .to{
            border-top: 1px solid #eeeeee;
        }
        .cen{
            display: flex;
            align-items: center;
        }
    }
</style>
