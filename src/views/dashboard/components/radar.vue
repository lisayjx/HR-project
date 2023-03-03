<template>
  <div ref="myDiv" class="radar" style="height: 400px;width: 600px;">
    <!-- 雷达图 图表必须给高和宽度-->
  </div>
</template>

<script>
// 完整加载
// var echarts = require('echarts')
// 按需加载
var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  name: 'Radar',
  data() {
    return {

    }
  },
  //   created创建实例了，但是页面没渲染呢，mounted渲染了
  mounted() {
    // myChart就是图表实例
    var myChart = echarts.init(this.$refs.myDiv)
    myChart.setOption({
      title: {
        text: '人力资源基础绩效表'
      },

      radar: {
        // shape: 'circle',每个区域得最高级
        indicator: [
          { name: '考勤', max: 6500 },
          { name: '工资', max: 16000 },
          { name: '社保', max: 30000 },
          { name: '工作效率', max: 38000 },
          { name: '知识分享', max: 52000 },
          { name: '代码行数', max: 25000 }
        ]
      },
      series: [
        {
          name: '预算 vs 开销',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: '预算'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: '开销'
            }
          ]
        }
      ]
    })
  },

  methods: {

  }
}
</script>

<style scoped >

</style>
