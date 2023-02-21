<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-card class="tree-card">
        <!-- 头部 树形组件-->
        <tree-tools
          :tree-node="company"
          :is-root="true"
          @addDept="handleAddDept"
        />
        <!-- 身体 树形结构组件-->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 插槽 树形组件 -->
          <tree-tools
            slot-scope="{data}"
            :tree-node="data"
            @UpdateDelDepartment="handleGetDepartments"
            @addDept="handleAddDept"
            @editDept="handleEditDepts"
          />
        </el-tree>

      </el-card>

      <!-- 点击增加部门出现的表单 -->
      <add-dept
        ref="addDept"
        :dialog-form-visible="dialogFormVisible"
        :node="node"
        @closePop="dialogFormVisible=false"
        @addDepts="handleGetDepartments"
      />

    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      company: { name: '', manager: '' },
      departs: [
        { name: '总裁办', manager: '张三', children: [{ name: '董事会', manager: '李四' }] },
        { name: '行政部', manager: '王二' },
        { name: '人事部', manager: '孙五' }],
      defaultProps: {
        label: 'name', // 表示 从这个属性显示内容
        children: 'children'
      },
      dialogFormVisible: false, // 是否显示弹窗表单
      node: null// 记录当前点击的node节点
    }
  },
  created() {
    this.handleGetDepartments()
  },
  methods: {
    async handleGetDepartments() {
      const re = await getDepartments()
      this.company = { name: 'xxxxxxxx科技股份有限公司', manager: '负责人', id: '' }
      this.departs = tranListToTreeData(re.depts, '') // 把获取来的数据转成树形结构
    },
    handleAddDept(node) {
    //  event是treeTool传来的当前点击得哪个结点
      this.dialogFormVisible = true
      this.node = node
    },
    handleEditDepts(node) {
      this.dialogFormVisible = true
      this.node = node
      // 去调用子组件 add-dept里面的handleGetDepartmentDetail方法
      this.$refs.addDept.handleGetDepartmentDetail(node.id)
    }
  }
}

</script>

  <style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
  </style>
