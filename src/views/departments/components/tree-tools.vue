<template>

  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col>{{ treeNode.name }}</el-col>

    <el-col :span="4">
      <el-row type="flex">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>

  </el-row>

</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  name: 'TreeTools',
  components: { },
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },

  methods: {
    // 增删改
    handleCommand(type) {
      if (type === 'add') {
        // 增
        // 通知父亲 显示弹窗表单
        this.$emit('addDept', this.treeNode)// this.treeNode当前点击的部门
      } else if (type === 'edit') {
        // 修改
        this.$emit('editDept', this.treeNode)
      } else {
        // 删除
        this.handleDelDepartment(this.treeNode.id)
      }
    },
    // 删除
    async  handleDelDepartment(id) {
      // confirm后   then 确定删除 catch 不删除
      //  删除操作
      this.$confirm('确定要删除该部门吗')
        .then(() => {
          // 如果点击了确定就会进入then
          return delDepartments(this.treeNode.id) // 返回promise对象
        })
        .then(() => {
          //  如果删除成功了  就会进入这里
          this.$emit('UpdateDelDepartment') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
    }

  }

}
</script>

<style scoped >

</style>
