<template>
  <div class="importExcel">
    <!-- 使用全局组件 upload-excel -->
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {

    }
  },

  methods: {
    async  success({ header, results }) {
    //   console.log(header, results)
      //   results里是 [{…}, {…}, {…},]，每一个对象里和userRelations一样
      //   自定义一个映射关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }

      //   把中文的key变成英文
      //   var arr=[]
      //   results.forEach(item => {
      //     var userInfo = {}
      //     Object.keys(item).forEach(key => {
      //       // key是中文
      //       userInfo[userRelations[key]] = item[key]//  相当于 userInfo[mobile]=mobile
      //     })
      //     arr.push(userInfo)
      //   })
      var newArr = results.map(item => {
        var userInfo = {}
        // Object.keys(item)得到  ['手机号', '姓名', '入职日期', '转正日期', '工号']
        Object.keys(item).forEach(key => {
          // item[key]是value
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            console.log(item[key], 1)// 44937
            console.log(this.formatDate(item[key], 2))// 20230210
            console.log(new Date(this.formatDate(item[key])))// Invalid Date
            console.log(new Date(this.formatDate(item[key], '/')))// Tue Feb 21 2023 00:00:00 GMT+0800 (中国标准时间)
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样, 才能入库
          } else {
            userInfo[userRelations[key]] = item[key]//  相当于 userInfo.mobile=mobile
          }
        })
        return userInfo
      })
      //   请求接口
      await importEmployee(newArr)
      this.$message.success('导入excel成功')
      this.$router.back() // 回到上一个页面
    },
    // 格式化excel时间
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped >
.importExcel{
  padding: 200px 0;
}
</style>
