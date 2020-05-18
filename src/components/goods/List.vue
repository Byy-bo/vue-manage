<template>
 <div>
    <el-card>
       <el-row :gutter="20">
            <el-col :span="10">
                <div class="grid-content bg-purple">
                   <el-input v-model="listInfo.query" clearable @clear="getList"  placeholder="请输入内容" class="input-with-select">
                        <el-button @click="getList" slot="append" icon="el-icon-search"></el-button>
                   </el-input>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <el-button type="primary" @click="toAddList">添加商品</el-button>
                </div>
            </el-col>
        </el-row>
         <el-table :data="listData" stripe border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column width="660px" prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
            <el-table-column prop="add_time" label="创建时间"></el-table-column>
            <el-table-column label="操作">
               <template #default="list">
                  <el-button @click="upDateList(list.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                  <el-button @click="removeList(list.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
               </template>
            </el-table-column>
         </el-table>
         <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listInfo.pagenum" :page-sizes="[10, 20, 30, 40, 50]" :page-size="listInfo.pagesize"
                       layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
        </el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" :visible.sync="dialogVisibleUp" width="50%" @close="listClose(1)">
        <el-form :model="upDateForm" :rules="upDateRules" ref="updateRuleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="upDateForm.goods_name"></el-input>
            </el-form-item>
             <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model.number="upDateForm.goods_price"></el-input>
            </el-form-item>
             <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model.number="upDateForm.goods_weight"></el-input>
            </el-form-item>
             <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model.number="upDateForm.goods_number"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleUp = false">取 消</el-button>
            <el-button type="primary" @click="getUpdatedList">确 定</el-button>
        </span>
    </el-dialog>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
     const validateNum = (rule, value, callback) => {
        if (!isNaN(value)) {
           return callback()
        }
        // 匹配错误返回错误信息
        callback(new Error('请输入一个正确的数字'))
     }
   return {
      listData: [],
      listInfo: {
         query: '',
         pagenum: 1,
         pagesize: 10
      },
      listTotal: 0,
      dialogVisibleUp: false,
      upDateForm: {
         goods_id: '',
         goods_name: '',
         goods_price: '',
         goods_weight: '',
         goods_number: '',
         goods_cat: ''
      },
      upDateRules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 16, max: 66, message: '长度在 16 到 66 个字符', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
          ]
      }
   }
  },
  created () {
     this.getList()
  },
  methods: {
    async getList() {
       const { data: res } = await this.$axios.get('goods', {
          params: this.listInfo
       })
       console.log(res)
       if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 成功的操作
        this.listData = res.data.goods
        this.listTotal = res.data.total
    },
    // 操作分页
    handleSizeChange(newPagesize) {
        // console.log(newPagenum)
        this.listInfo.pagesize = newPagesize
        this.getList()
    },
    handleCurrentChange(newPagenum) {
        // console.log(newPagesize)
        this.listInfo.pagenum = newPagenum
        this.getList()
    },
    // 监听对话框关闭
    listClose(num) {
       if (num === 1) {
          this.$refs.updateRuleForm.resetFields()
       }
    },
    // 点击删除
    async removeList(lisRo) {
        const confirm = await this.$confirm.confirm('此操作将永久删除此分类,确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)
        // console.log(confirm)
        if (confirm !== 'confirm') return this.$message.info('已取消删除')
        // console.log(cdRo.cat_id)
        // 发起删除请求
        console.log(lisRo.goods_id)
        const { data: res } = await this.$axios.delete(`goods/${lisRo.goods_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除商品失败, 请稍后再试')
        // 成功
        this.$message({
            message: '删除商品成功',
            type: 'success'
        })
        this.listInfo.pagenum = (this.listTotal - 1) / (this.listInfo.pagenum - 1) ? this.listInfo.pagenum - 1 : this.listInfo.pagenum
        // 重新渲染数据
        this.getList()
    },
    // 点击根据id查询我的数据
    async upDateList(lisRo) {
       const { data: res } = await this.$axios.get(`goods/${lisRo.goods_id}`)
       console.log(res)
       this.upDateForm = {
         goods_id: res.data.goods_id,
         goods_name: res.data.goods_name,
         goods_price: res.data.goods_price,
         goods_weight: res.data.goods_weight,
         goods_number: res.data.goods_number,
         goods_cat: res.data.goods_cat
      }
      // 显示对话框
      this.dialogVisibleUp = true
    },
   // 点击请求编辑提交
   getUpdatedList() {
      this.$refs.updateRuleForm.validate(async valid => {
         if (!valid) return this.$message.error('请输入正确的信息')
         // console.log(this.upDateForm)
         const { data: res } = await this.$axios.put(`goods/${this.upDateForm.goods_id}`, {
            goods_name: this.upDateForm.goods_name,
            goods_price: this.upDateForm.goods_price,
            goods_number: this.upDateForm.goods_number,
            goods_weight: this.upDateForm.goods_weight,
            goods_cat: this.upDateForm.goods_cat
         })
         // console.log(res)
         if (res.meta.status !== 200) return this.$message.error('编辑商品失败, 请稍后再试')
        // 成功
        this.$message({
            message: '编辑除商品成功',
            type: 'success'
        })
         // 重新渲染数据
         this.getList()
         // 消失对话框
         this.dialogVisibleUp = false
      })
   },
   // 添加商品跳转
   toAddList() {
      this.$router.push({ path: '/goods/add' })
   }
  },
  components: {
  }
 }
</script>

<style lang="less" scoped>
   .el-table{
      margin: 20px 0;
   }
</style>
