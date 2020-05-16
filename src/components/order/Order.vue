<template>
 <div>
     <el-card>
         <el-row>
            <el-col :span="10">
                <div class="grid-content bg-purple">
                   <el-input v-model="orderInfo.query" clearable @clear="getOrder"  placeholder="请输入内容" class="input-with-select">
                        <el-button @click="getOrder" slot="append" icon="el-icon-search"></el-button>
                   </el-input>
                </div>
            </el-col>
        </el-row>
        <el-table :data='orderData' stripe border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="order_number" label="订单编号"></el-table-column>
            <el-table-column prop="order_price" label="订单价格"></el-table-column>
            <el-table-column prop="order_pay" label="是否付款">
                <template #default="order">
                    <el-tag type="danger" v-if="order.row.order_pay === '0'">未付款</el-tag>
                    <el-tag type="success" v-else>已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货"></el-table-column>
            <el-table-column prop="create_time" label="下单时间"></el-table-column>
            <el-table-column label="操作"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="orderInfo.pagenum" :page-sizes="[10, 20, 30]" :page-size="orderInfo.pagesize"
                       layout="total, sizes, prev, pager, next, jumper" :total="orderTotal">
        </el-pagination>
     </el-card>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
       orderData: [],
       orderInfo: {
           query: '',
           pagenum: 1,
           pagesize: 10
       },
       orderTotal: 0
   }
  },
  created () {
      this.getOrder()
  },
  methods: {
      async getOrder() {
          const { data: res } = await this.$axios.get('orders', {
              params: this.orderInfo
          })
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 成功
          this.orderData = res.data.goods
          this.orderTotal = res.data.total
      },
    // 操作分页
    handleSizeChange(newPagesize) {
        // console.log(newPagenum)
        this.orderInfo.pagesize = newPagesize
        this.getOrder()
    },
    handleCurrentChange(newPagenum) {
        // console.log(newPagesize)
        this.orderInfo.pagenum = newPagenum
        this.getOrder()
    }
  },
  components: {
  }
 }
</script>

<style lang="less" scoped>
    .el-table{
        margin: 16px 0;
    }
</style>
