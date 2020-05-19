<template>
 <div>
     <el-card>
         <div id="main" style="width:750px;height:400px;"></div>
     </el-card>
 </div>
</template>

<script>
// 导入我的echarts
import echarts from 'echarts'
// 导入lodash
import _ from 'lodash'
 export default {
  name: '',
  data () {
   return {
       options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted () {
    // 初始化
    const myChart = echarts.init(document.getElementById('main'))
    // 请求
    const { data: res } = await this.$axios.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取数据失败')
    // 合并我的数据
    const resData = _.merge(res.data, this.options)
    // console.log(resData)
    myChart.setOption(resData)
  },
  components: {
  }
 }
</script>

<style scoped>
</style>
