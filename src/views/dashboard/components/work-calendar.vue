<template>
  <div>
    <!-- 选择器组件 年月 -->
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <!-- 年用组件给定一个日期，日期获取年，年取前五年＋后五年 -->
      <el-select
        v-model="currentYear"
        style="width: 120px"
        size="small"
        @change="changeDate"
      >
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- 月 -->
      <el-select
        v-model="currentMonth"
        style="width: 120px;margin-left: 10px;"
        size="small"
        @change="changeDate"
      >
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <!-- 日历 -->
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{date,data}">
        <div class="date-content">
          <span class="text">  {{ data.day |formatDay }}</span>
          <!-- 休息 -->
          <div v-if="isWeek(date)" class="rest">休</div>
        </div>

      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  components: {},
  filters: {
    formatDay(value) {
      // 2023-02-13字符串
      const day = value.split('-')[2] // 找到最后得
      //   是0开头吗？是就截掉
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date() // 如果没有传递startDate就取当前时间
    }
  },
  data() {
    return {
      yearList: [], // 要遍历的年的数组
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null // 当前日期
    }
  },
  created() {
    // 获取当前年份
    this.currentYear = this.startDate.getFullYear()
    // 获取当前月份，组件要求起始时间必须是 周一开始 以一个月为开始
    this.currentMonth = this.startDate.getMonth() + 1
    // 生成的1-100的数组
    // Array.from(Array(100), function(value, index) { return index + 1 })
    // 年取前五年+后五年
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
    // 初始化时候也要调用一下这个方法 否则当前日期是null
    this.changeDate()
  },
  methods: {
    // 选择器日期改变时
    changeDate() {
      // 把选择器的日期转化成日历能识别的日期
      const year = this.currentYear
      const month = this.currentMonth
      //   ${month}-1对 ${month-1}不对
      this.currentDate = new Date(`${year}-${month}-1`)//   以当前月的1号为起始
    },
    isWeek(date) { // date是当前时间
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style scoped  >
/* /deep/ 如果报了语法错误，那么改成::v-deep这种写法就不报错了 */
/deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
