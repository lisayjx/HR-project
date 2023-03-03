<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:right>
          <el-button
            type="primary"
            size="small"
            @click="addPermission('1','0')"
          >添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table
        border
        :data="permissionList"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        lazy
        :indent="52"
      >

        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <!-- 添加按钮 只在访问权的层级显示 ，当type=1时才显示添加按钮 -->
            <el-button
              v-if="row.type===1"
              type="text"
              @click="addPermission('2',row.id)"
            >添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 弹窗 -->
      <el-dialog :visible.sync="showDialog" :title="formatTitle" @close="closeDialog">
        <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="开启" prop="enVisible">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" @click="btnOk">确定</el-button>
            <el-button type="default" @click="closeDialog">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { updatePermission, addPermission, getPermissionDetail, delPermission, getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: '',
  components: {},
  data() {
    return {
      permissionList: [], // 权限列表
      // 权限表单
      formData: {
        enVisible: '0', // 1开启，0关闭
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型不需要显示到弹窗 因为点击添加时候已经知道类型了
        pid: ''// 因为做的是树，需要知道添加到哪个节点下了
      },
      showDialog: false,
      rules: {
        name: [{ required: true, trigger: 'blur', message: '权限名不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '权限标识不能为空' }]
      },
      title: ''

    }
  },
  computed: {
    formatTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 得到权限列表
    async  getPermissionList() {
      // 因为pid=0是根级访问权，1是子级操作权
      // 转化成了带children的树形结构
      this.permissionList = tranListToTreeData(await getPermissionList(), '0')
    },
    // 点击关闭
    closeDialog() {
      this.formData = {
        enVisible: '0',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }
      this.$refs.form.resetFields()
      this.showDialog = false
    },
    // 点击删除
    delPermission(row) {
      this.$confirm(`确认删除${row.name}权限点吗?`).then(() => {
        return delPermission(row.id)
      }).then(() => {
        this.$message.success(`删除权限${row.name}成功`)
        this.getPermissionList()
      })
    },
    // 点击添加,因为有两个添加按钮,需要知道添加的是几级权限
    addPermission(type, pid) {
      // type=1是访问权，=2是操作权，pid表示当前数据的父节点的标识
      // 记录当前的类型和父亲标识
      this.formData.type = type
      this.formData.pid = pid
      // 打开弹窗
      this.showDialog = true
    },
    // 点击确定
    async  btnOk() {
      try {
        await this.$refs.form.validate()
        if (this.formData.id) { // 有id是编辑
          await updatePermission(this.formData)
        } else { // 没有id是新增
          await addPermission(this.formData)
        }
        this.showDialog = false
        this.getPermissionList()
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击编辑
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style >

</style>
