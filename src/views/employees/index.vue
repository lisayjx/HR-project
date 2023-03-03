<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 使用全局组件 PageTools-->
      <page-tools :show-left="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:left>
          <span>共有{{ total }}条记录</span>
        </template>

        <!-- 右侧显示excel导入导出新增按钮 -->
        <template v-slot:right>
          <el-button type="success" size="small" @click="$router.push('/import')">导入Excel</el-button>
          <el-button type="danger" size="small" @click="exportExcel">导出Excel</el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="!checkPermission('aa')"
            @click="showDialog=true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" prop="staffPhoto" width="130px" align="center">
            <template v-slot="{row}">
              <img
                ref="staffPhoto"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="width: 80px;height: 80px;border-radius: 100%;"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" :formatter="formatEmployment" sortable="" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ row.timeOfEntry|formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{row}">
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button
                type="text"
                size="small"
                :disabled="!checkPermission('aa')"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="showRole(row.id)">角色</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="!checkPermission('aa')"
                @click="handleDelEmployee(row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :current-page="page"
            :page-size="size"
            @current-change="changePage"
          />
        </el-row>
      </el-card>

      <!-- 弹窗组件 -->
      <add-employee :show-dialog.sync="showDialog" />
      <!-- 二维码弹窗 -->
      <el-dialog title="二维码" :visible.sync="showQrDialog">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
      <!-- 分配角色弹窗 -->
      <assign-role
        ref="rolePop"
        :show-role-dialog="showRoleDialog"
        :user-id="userId"
        @closeRolePop="showRoleDialog=false"
      />
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 员工信息的枚举
import { delEmployee } from '@/api/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
// 引入二维码工具
import QrCode from 'qrcode'
// 引入格式化时间工具
import { formatDate } from '@/filters'
import checkPermission from '@/mixin/checkPermission'
export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      list: [], // 员工列表
      loading: false, // 控制遮罩层
      showDialog: false, // 控制弹窗
      showQrDialog: false, // 控制二维码弹窗
      showRoleDialog: false, // 控制分配角色的组件的弹窗
      userId: ''// 当前点击的用户 id
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async  getEmployeeList() {
      this.loading = true
      const re = await getEmployeeList({
        page: this.page,
        size: this.size
      })
      this.list = re.rows
      this.total = re.total
      this.loading = false
    },

    // 换页
    changePage(newPage) {
      this.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 去EmployeeEnum里找1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async   handleDelEmployee(row) {
      // console.log(row.id)
      try {
        await this.$confirm('您确定要删除该员工吗?')
        await delEmployee(row.id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel
    async  exportExcel() {
      // 数据映射
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 请求接口 所有员工数据
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      // 格式化员工数据
      const data = this.formatList(headers, rows)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 中文 必填
          data: data, // 具体数据 必填 [[],[]]
          filename: '员工信息表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 格式化员工数据
    // 传headers是为了表头对应关系
    formatList(headers, rows) {
      // console.log(rows)// [{},{},{}]
      // 需要把 [{ username: '张三', mobile: '13811111111', ...},{},{}]  => [[’张三', '13811111111',...],[],[]]
      // 需要把每个对象里的value取出来组成数组，所以需要把每个对象里的key找到

      return rows.map(item => {
        // item是每个员工信息的对象
        return Object.keys(headers).map(key => { // key是手机号，姓名..
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const isRepeat = EmployeeEnum.hireType.find(obj => {
              // 查找数组中符合条件的第一个元素
              return obj.id === item[headers[key]]
            })
            return isRepeat ? isRepeat.value : '未知'
          }

          // headers[key]是mobile，username
          return item[headers[key]]
        })
      })
    },
    // 点击头像弹出二维码
    showQrCode(url) {
      if (url) {
        this.showQrDialog = true// 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！s
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url)
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        return this.$message.warning('此用户还没有上传头像')
      }
    },
    // 点击角色时
    async  showRole(id) {
      this.userId = id

      // 调用子组件的方法await 解决闪动问题，等数据出来再弹层
      await this.$refs.rolePop.getUserDetailById(id)

      this.showRoleDialog = true
    }
  }
}
//  // 聘用形式
//  hireType: [
//     {
//       id: 1,
//       value: '正式'
//     },
//     {
//       id: 2,
//       value: '非正式'
//     }
//   ],
</script>

  <style>

  </style>
