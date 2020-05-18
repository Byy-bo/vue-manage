<template>
 <div>
     <el-card>
         <el-alert :closable="false" title="注意只允许为第三级分类设置参数" show-icon type="warning"></el-alert>
         <el-row>
             <el-col>
                 <span>选择商品分类：</span>
                 <el-cascader  v-model="paramsValue" :options="paramsOptions" :props="paramsProps"
                @change="handleChange" clearable></el-cascader>
             </el-col>
         </el-row>
         <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button :disabled="!showf" type="primary" size="mini" @click='addParams(1)'>添加参数</el-button>
                <el-table border stripe :data="paramsData">
                    <el-table-column type="expand">
                        <template #default="many">
                            <el-tag @close="paramsTagRemove(many.row, index)" closable v-for="(item,  index) in many.row.attr_vals" :key="item.id">{{ item }}</el-tag>
                            <el-input class="input-new-tag" v-if="many.row.inputVisible" v-model="many.row.inputValue" ref="saveTagInput" size="small"
                            @keyup.enter.native="handleInputConfirm(many.row)" @blur="handleInputConfirm(many.row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(many.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column label="操作">
                        <template #default="many">
                            <el-button type="primary" size="mini" @click="upParams(many.row)">编辑</el-button>
                            <el-button type="danger" size="mini" @click="removeParams(many.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button :disabled="!showf" type="primary" size="mini" @click="addParams(2)">添加属性</el-button>
                 <el-table border stripe :data="paramsData">
                    <el-table-column type="expand">
                        <template #default="only">
                            <el-tag closable @close="paramsTagRemove(only.row, index)" v-for="(item,  index) in only.row.attr_vals" :key="item.id">{{ item }}</el-tag>
                            <el-input class="input-new-tag" v-if="only.row.inputVisible" v-model="only.row.inputValue" ref="saveTagInput" size="small"
                            @keyup.enter.native="handleInputConfirm(only.row)" @blur="handleInputConfirm(only.row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(only.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                    <el-table-column label="操作">
                        <template #default="only">
                            <el-button type="primary" size="mini" @click="upParams(only.row)">编辑</el-button>
                            <el-button type="danger" size="mini" @click="removeParams(only.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
         </el-tabs>
     </el-card>

     <!-- 添加动态参数或者静态属性 -->
     <el-dialog :title="addTitle" :visible.sync="dialogVisible" width="50%" @close="paramsClose(1)">
        <el-form :model="addCs" :rules="AddRules" ref="addCsRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item :label="addLabel" prop="attr_name">
                <el-input v-model="addCs.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="getAddParams">确 定</el-button>
        </span>
     </el-dialog>

     <!-- 编辑参数或者静态属性 -->
     <el-dialog :title="upTitle" :visible.sync="dialogVisibleUp" width="50%" @close="paramsClose(2)">
        <el-form :model="upCs" :rules="AddRules" ref="upCsRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item :label="upLabel" prop="attr_name">
                <el-input v-model="upCs.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleUp = false">取 消</el-button>
            <el-button type="primary" @click="getUpParams">确 定</el-button>
        </span>
     </el-dialog>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
       paramsValue: [],
       paramsOptions: [],
       paramsProps: {
           label: 'cat_name',
           expandTrigger: 'hover',
           value: 'cat_id'
       },
       activeName: 'many',
       paramsData: [],
       addCs: {
           cat_id: '',
           attr_name: '',
           attr_sel: '',
           attr_vals: ''
       },
       upCs: {
           attr_id: '',
           attr_name: '',
           attr_sel: '',
           attr_vals: ''
       },
       addTitle: '添加动态参数',
       addLabel: '动态参数',
       upTitle: '修改动态参数',
       upLabel: '动态参数',
       AddRules: {
           attr_name: [
               { required: true, message: '请输入正确的信息', trigger: 'blur' },
               { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
           ]
       },
       dialogVisible: false,
       dialogVisibleUp: false
   }
  },
  created () {
      this.getParamsOptions()
  },
  methods: {
    // 渲染我的级联选择器
    async getParamsOptions() {
        // 请求数据渲染我的级联选择器
        const { data: res } = await this.$axios.get('categories', {
            params: {
                type: 3
            }
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 成功
        this.paramsOptions = res.data
    },
    // 级联选择后
    async handleChange() {
        // 判断是否是三级分类
        if (this.paramsValue.length !== 3) {
            this.paramsValue = []
            this.paramsData = []
            return
        }
        // 存我的分类id
        this.addCs.cat_id = this.paramsValue[this.paramsValue.length - 1]
        // console.log(this.paramsValue[this.paramsValue.length - 1])
        // 请求数据
        const { data: res } = await this.$axios.get(`categories/${this.paramsValue[this.paramsValue.length - 1]}/attributes`, {
            params: {
                sel: this.activeName
            }
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 处理我的数据
        res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length ? item.attr_vals.split(',') : []
            item.inputVisible = false
            item.inputValue = ''
        })
        // console.log(res.data.attr_vals)
        // res.data.inputVisible = false
        // res.data.inputValue = ''
        // 成功
        this.paramsData = res.data
    },
    handleClick(tab) {
        // console.log(tab.name)
        this.activeName = tab.name
        // 渲染对应的表格
        this.handleChange()
    },
    // 按enter键触发和失去焦点的时候触发
    async handleInputConfirm(row) {
        if (!row.inputValue.trim()) {
            row.inputVisible = false
            return
        }
        // 如果有的话
        row.attr_vals.push(row.inputValue)
        // 更新后台数据
        const { data: res } = await this.$axios.put(`categories/${this.addCs.cat_id}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(',')
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        // 成功
        this.$message({
            message: '更新成功',
            type: 'success'
        })
        row.inputValue = ''
        row.inputVisible = false
    },
    showInput(row) {
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
    },
    // 监听我的对话框关闭事件
    paramsClose(num) {
        if (num === 1) {
            this.$refs.addCsRuleForm.resetFields()
        } else if (num === 2) {
            this.$refs.upCsRuleForm.resetFields()
        }
    },
    // 添加参数或者属性之显示渲染弹框
    addParams(num) {
        if (num === 1) {
            // 则是添加参数
            this.addTitle = '添加动态参数'
            this.addLabel = '动态参数'
            this.addCs.attr_vals = 'a,b,c'
        } else if (num === 2) {
            // 则是添加静态属性
            this.addTitle = '添加静态属性'
            this.addLabel = '静态属性'
            this.addCs.attr_vals = ''
        }
        // 显示对话框
        this.dialogVisible = true
    },
    // 添加参数或者属性请求
    getAddParams() {
        this.$refs.addCsRuleForm.validate(async valid => {
            if (!valid) return this.$message.error('请输入正确的信息')
            // 表单验证成功
            const { data: res } = await this.$axios.post(`categories/${this.addCs.cat_id}/attributes`, {
                attr_name: this.addCs.attr_name,
                attr_sel: this.activeName,
                attr_vals: this.addCs.attr_vals
            })
            console.log(res)
            if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
            // 成功
            // 重新渲染数据
            this.handleChange()
            // 对话框消失
            this.dialogVisible = false
        })
    },
    // 删除我的可选项
    async paramsTagRemove(row, index) {
        row.attr_vals.splice(index, 1)
        // 更新后台数据
        const { data: res } = await this.$axios.put(`categories/${this.addCs.cat_id}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(',')
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        // 成功
        this.$message({
            message: '删除成功',
            type: 'success'
        })
    },
    // 编辑参数属性的对话框显示渲染
    upParams(row) {
        if (row.attr_sel === 'many') {
            // 则是编辑参数
            this.upTitle = '编辑动态参数'
            this.upLabel = '动态参数'
        } else {
            // 则是添加静态属性
            this.upTitle = '编辑静态属性'
            this.upLabel = '静态属性'
        }
        this.upCs = {
            attr_id: row.attr_id,
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals
        }
        // 显示我的对话框
        this.dialogVisibleUp = true
    },
    // 编辑参数属性请求
    async getUpParams() {
        const { data: res } = await this.$axios.put(`categories/${this.addCs.cat_id}/attributes/${this.upCs.attr_id}`, {
            attr_name: this.upCs.attr_name,
            attr_sel: this.upCs.attr_sel,
            attr_vals: this.upCs.attr_vals.join(',')
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('编辑失败')
        // 成功
        this.$message({
            message: '编辑成功',
            type: 'success'
        })
        // 重新渲染数据
        this.handleChange()
        // 对话框消失
        this.dialogVisibleUp = false
    },
    // 点击删除
    async removeParams(id) {
        const confirm = await this.$confirm.confirm('此操作将永久删除此数据,确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)
         console.log(id)
         console.log(this.addCs.cat_id)
        if (confirm !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await this.$axios.delete(`categories/${this.addCs.cat_id}/attributes/${id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        // 成功
        this.$message({
            message: '删除成功',
            type: 'success'
        })
        // 重新渲染数据
        this.handleChange()
    }
  },
  computed: {
    // 判断是否禁用我的button
    showf() {
        return this.paramsValue.length === 3
    }
  },
  components: {
  }
 }
</script>

<style lang="less" scoped>
    .el-row{
        margin: 20px 0;
    }
    .el-table{
        margin-top: 16px;
        .el-tag{
            margin: 0 8px 8px 0;
        }
        .el-input{
            width: 200px;
        }
    }
</style>
