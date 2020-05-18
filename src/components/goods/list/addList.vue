<template>
 <div>
     <el-card>
         <el-alert title="添加商品信息" center type="info" :closable="false" show-icon></el-alert>
         <el-steps :active="activeIndex - 0" align-center finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" class="demo-ruleForm">
            <el-tabs :before-leave="handleLeave" v-model="activeName" :tab-position="tabPosition" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addRuleForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input type="number" v-model="addRuleForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input type="number"  v-model="addRuleForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input type="number"  v-model="addRuleForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <br />
                        <el-cascader  v-model="addRuleForm.goods_cat" :options="paramsOptions" :props="paramsProps"
                        @change="handleChange" clearable></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-row>
                        <el-col v-for="item in checkData" :key="item.attr_id">
                            <p>{{ item.attr_name }}</p>
                            <el-checkbox v-for="itemT in item.attr_vals" :key="itemT.id" checked :label="itemT" border></el-checkbox>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
                    multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <quill-editor v-model="addRuleForm.goods_introduce"></quill-editor>
                    <el-button type="primary">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>
     </el-card>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
       checkData: [],
       activeIndex: 0,
       tabPosition: 'left',
       activeName: '0',
       addRuleForm: {
           goods_name: '',
           goods_price: '',
           goods_weight: '',
           goods_number: '',
           goods_cat: [],
           goods_introduce: ''
       },
       paramsOptions: [],
       paramsProps: {
           label: 'cat_name',
           expandTrigger: 'hover',
           value: 'cat_id'
       },
       addRules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 16, max: 66, message: '长度在 16 到 66 个字符', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          goods_cat: [
            { required: true, message: '请选择商品三级分类', trigger: 'change' }
          ]
       },
       fileList: []
   }
  },
  created() {
      this.getParamsOptions()
  },
  methods: {
    // 监听标签页的选择
    handleClick() {
        this.activeIndex = this.activeName
    },
    // 离开某个标签页之前
    handleLeave(newIndex, oldIndex) {
        // console.log(newIndex, oldIndex)
        if (oldIndex === '0' && this.addRuleForm.goods_cat.length !== 3) {
            this.$message.error('请选择正确的商品分类')
            return false
        }
    },
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
        if (this.addRuleForm.goods_cat.length !== 3) {
            this.addRuleForm.goods_cat = []
            return
        }
        const { data: res } = await this.$axios.get(`categories/${this.addRuleForm.goods_cat[this.addRuleForm.goods_cat.length - 1]}/attributes`, {
            params: {
                sel: 'many'
            }
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 处理我的数据
        res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length ? item.attr_vals.split(',') : []
        })
        // 赋值
        this.checkData = res.data
    },
    // 操作上传图片
    handlePreview() {
    },
    handleRemove() {
    },
    beforeRemove() {
    },
    handleExceed() {
    }
  },
  components: {
  }
 }
</script>

<style lang="less" scoped>
    .el-steps{
        margin: 20px 0;
    }
    .el-form{
        .el-tabs{
            .el-col{
                margin: 10px 0;
                p{
                    font-size: 14px;
                    color: #666666;
                    margin: 8px 0;
                }
                .el-checkbox{
                    margin-top: 8px;
                    margin-bottom: 8px;
                }
            }
            .quill-editor{
                height: 300px;
                margin-bottom: 60px;
            }
        }
    }
</style>
