<!-- 分配角色窗体组件 -->
<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="closePop">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 要显示角色名称存储角色id 本来是label既显示又存储，此时label表示要存储的值 -->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 选项 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="isOk">确定</el-button>
        <el-button size="small" @click="closePop">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { saveAssignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    }, // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleIds: [], // 存储当前用户所拥有的角色id，绑定给el-checkbox-group
      roleList: null // 存储当前所有的角色id
    }
  },
  created() {
    this.getRoleList() // 获取所有角色
    // this.getUserDetailById() // 获取当前用户角色
  },

  methods: {
    // 获取所有角色
    async   getRoleList() {
      const { rows } = await getRoleList({
        page: 1,
        pagesize: 10
      })
      this.roleList = rows
    },
    // 获取当前用户角色
    async getUserDetailById(id) {
      // 如果这里用props传来的userId就错了 ，因为props是异步的 读取不到
    //   这个方法是给父组件来调用的
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    // 关闭弹窗时候
    closePop() {
      // 通知父亲关闭弹窗
    //   this.$emit('closeRolePop')
      this.roleIds = []
      this.$parent.showRoleDialog = false
    },
    // 点击确定时候
    async isOk() {
      await saveAssignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      // 通知父亲关闭弹窗
      //   this.$emit('closeRolePop')
      this.$parent.showRoleDialog = false
      this.$message.success('更新角色成功')
    }
  }
}
</script>

<style scoped lang="less">

</style>
