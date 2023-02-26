<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="closePop">
    <el-form ref="employeeForm" label-width="120px" :model="employeeForm" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="employeeForm.username" placeholder="请输入姓名" style="width:80%" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="employeeForm.mobile" placeholder="请输入手机号" style="width:80%" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="employeeForm.timeOfEntry" placeholder="请选择日期" style="width:80%" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">

        <el-select v-model="employeeForm.formOfEmployment" placeholder="请选择" style="width:80%">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.value" />
        </el-select>

      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="employeeForm.workNumber" placeholder="请输入工号" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="employeeForm.departmentName" clearable placeholder="请选择部门" style="width:80%" @focus="chooseDepartment" />
        <!-- 树形结构 -->
        <el-tree
          v-if="showTree"
          :data="treeDepartmentList"
          :props="defaultProps"
          default-expand-all
          @focus="showTree=true"
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="employeeForm.correctionTime" placeholder="请选择日期" style="width:80%" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" style="margin-right: 20px;" @click="closePop">取消</el-button>
          <el-button type="primary" size="small" @click="isOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import EmployeeEnum from '@/api/constant/employees' // 员工信息的枚举
export default {
  name: '',
  components: {},

  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 2, max: 4, message: '用户姓名为2-4位', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        // 这里是change
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeDepartmentList: [], // 树形部门列表
      showTree: false,

      defaultProps: {
        children: 'children',
        label: 'name'
      },
      EmployeeEnum: EmployeeEnum
    }
  },
  computed: {},

  methods: {
    closePop() {
      this.$emit('update:showDialog', false)
      // 重置表单
      this.employeeForm = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      //   重置表单校验
      this.$refs.employeeForm.resetFields()
      this.$emit('update:showDialog', false)// update:props名称这么写的话可以在父组件直接用sync修饰符处理
    },
    // 点击选择部门
    async chooseDepartment() {
      // 获取最新部门架构
      const { depts } = await getDepartments()
      this.treeDepartmentList = tranListToTreeData(depts, '') // 把depts转换成树形结构
      //   console.log(this.treeDepartmentList)
      this.showTree = true
    },
    async  isOk() {
      try {
        await this.$refs.employeeForm.validate()
        //  await等验证通过
        await addEmployee(this.employeeForm)
        // 通知父组件更新数据
        // this.$emit('updateDeptsList')
        // this.$parent里有this.$parent.getEmployeeList()才执行 如果没有就不执行
        this.$parent.getEmployeeList() && this.$parent.getEmployeeList()// 父组件实例， 直接调用父组件的更新发给发
        this.$parent.showDialog = false
      } catch (error) {
        // 如果校验没通过
        console.log(error)
      }
    },
    handleNodeClick(node) {
      // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
      this.employeeForm.departmentName = node.name
      this.showTree = false
    }

  }
}
</script>

<style scoped >

</style>
