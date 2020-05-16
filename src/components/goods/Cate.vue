<template>
 <div>
     <el-card>
        <el-button type="primary" @click="addCate">添加分类</el-button>
        <tree-table show-index ref="cateTable" index-text="#" :data="cateData" :columns="columns" :selection-type="false"
        :expand-type="false">
            <template #isOk="ok">
                <i  class="el-icon-success" v-if="ok.row.cat_deleted === false" style="color:lightgreen"></i>
                <i  class="el-icon-error" v-else style="color:red"></i>
            </template>
            <template #px="pd">
                <el-tag v-if="pd.row.cat_level === 0" size="mini">一级</el-tag>
                <el-tag v-if="pd.row.cat_level === 1" type="success" size="mini">二级</el-tag>
                <el-tag v-if="pd.row.cat_level === 2" type="warning" size="mini">三级</el-tag>
            </template>
            <template #cz="cd">
                <el-button @click="upDateCate(cd.row)" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button @click="removeCate(cd.row)" type="danger" icon="el-icon-delete">删除</el-button>
            </template>
        </tree-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="cateList.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="cateList.pagesize"
                       layout="total, sizes, prev, pager, next, jumper" :total="cateTotal">
        </el-pagination>
     </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="50%" @close="cateClose(1)">
        <el-form :model="addForm" :rules="AddRules" ref="AddRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类" prop="cat_pid">
                <el-cascader  v-model="cateValue" :options="cateOptions" :props="cateProps"
                @change="handleChange" clearable></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="getAddCate">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="dialogVisibleUp" width="50%" @close="cateClose(2)">
        <el-form :model="upDateForm" :rules="AddRules" ref="upDateRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="upDateForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleUp = false">取 消</el-button>
            <el-button type="primary" @click="getUpDateCate">确 定</el-button>
        </span>
    </el-dialog>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
       cateData: [],
       columns: [
           { label: '分类名称', prop: 'cat_name' },
           { label: '是否有效', type: 'template', template: 'isOk' },
           { label: '排序', type: 'template', template: 'px' },
           { label: '操作', type: 'template', template: 'cz' }
       ],
       // 列表参数
       cateList: {
           type: 3,
           pagenum: 1,
           pagesize: 5
       },
       // 用来保存总条数
       cateTotal: 0,
       dialogVisible: false,
       dialogVisibleUp: false,
       addForm: {
           cat_name: '',
           cat_pid:0,
           cat_level:0
       },
       upDateForm: {
           cat_name: '',
           cat_id: 0
       },
       AddRules: {
           cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ]
       },
       // 级联选择器
       cateOptions: [],
       // 选中的值
       cateValue: [],
       // 级联选择器的配置项
       cateProps: {
           expandTrigger: 'hover',
           label: 'cat_name',
           children: 'children',
           value: 'cat_id',
           checkStrictly: true // 禁止父子级联互相关联
        }
   }
  },
  created () {
      this.getCate()
  },
  methods: {
    // 请求商品分类数据
    async getCate() {
        const { data: res } = await this.$axios.get('categories', {
            params: this.cateList
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 成功
        this.cateData = res.data.result
        // 总条数
        this.cateTotal = res.data.total
    },
    // 操作分页
    handleSizeChange(newPagesize) {
        // console.log(newPagenum)
        this.cateList.pagesize = newPagesize
        this.getCate()
    },
    handleCurrentChange(newPagenum) {
        // console.log(newPagesize)
        this.cateList.pagenum = newPagenum
        this.getCate()
    },
    // 监听对话框关闭
    cateClose(num) {
        if (num === 1) {
            this.$refs.AddRuleForm.resetFields()
        } else if (num === 2) {
            this.$refs.upDateRuleForm.resetFields()
        }
    },
    // 点击添加分类
    async addCate() {
        // 请求数据渲染我的级联选择器
        const { data: res } = await this.$axios.get('categories', {
            params: {
                type: 2
            }
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 成功
        this.cateOptions = res.data
        // 显示对话框
        this.dialogVisible = true
    },
    // 监听我的选择的分类
    handleChange() {
        // console.log(this.cateValue)
        // 选择了分类
        if (this.cateValue.length > 0) {
            this.addForm.cat_pid = this.cateValue[this.cateValue.length - 1]
            this.addForm.cat_level = this.cateValue.length
        } else {
            this.addForm.cat_id = 0
            this.addForm.cat_level = 0
        }
    },
    // 添加分类的确定
    async getAddCate() {
        console.log(this.addForm)
        const { data: res } = await this.$axios.post('categories', this.addForm)
        console.log(res)
         if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        // 成功
        this.getCate()
        // 消失对话框
        this.dialogVisible = false
    },
    // 点击删除
    async removeCate(cdRo) {
        const confirm = await this.$confirm.confirm('此操作将永久删除此分类,确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)
        // console.log(confirm)
        if (confirm !== 'confirm') return this.$message.info('已取消删除')
        // console.log(cdRo.cat_id)
        // 发起删除请求
        const { data: res } = await this.$axios.delete(`categories/${cdRo.cat_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除分类失败, 请稍后再试')
        // 成功
        this.$message({
            message: '删除分类成功',
            type: 'success'
        })
        this.cateList.pagenum = (this.cateTotal - 1) / (this.cateList.pagenum - 1) ? this.cateList.pagenum - 1 : this.cateList.pagenum
        // 重新渲染数据
        this.getCate()
    },
    // 编辑分类
    async upDateCate(cdRo) {
        const { data: res } = await this.$axios.get(`categories/${cdRo.cat_id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.upDateForm = {
           cat_name: res.data.cat_name,
           cat_id: res.data.cat_id
        }
        // 显示对话框
        this.dialogVisibleUp = true
    },
    async getUpDateCate() {
        // console.log(this.upDateForm)
        const { data: res } = await this.$axios.put(`categories/${this.upDateForm.cat_id}`, {
            cat_name: this.upDateForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 成功
        this.$message({
            message: '编辑分类成功',
            type: 'success'
        })
        // 重新渲染数据
        this.getCate()
        // 消失对话框
        this.dialogVisibleUp = false
    }
  },
  components: {
  }
 }
</script>

<style lang="less" scoped>
    .zk-table{
        margin: 16px 0;
    }
    .el-cascader {
        width: 100%;
        .el-input__inner{
            width: 100%;
        }
    }
</style>
