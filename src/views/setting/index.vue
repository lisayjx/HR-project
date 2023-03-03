<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card style="padding:30px">
        <el-tabs>
          <!-- 角色 -->
          <el-tab-pane label="角色管理" name="first">
            <!-- 按钮 -->
            <el-row>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                style="margin:20px"
                @click="dialogVisible=true"
              >新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border :data="list">
              <el-table-column label="序号" type="index" width="100" align="center" />
              <el-table-column label="角色名" prop="name" width="200" align="center" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作" width="300" align="center">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="updateRole(row.id)">修改</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end" style="margin-top: 30px;">
              <!-- 分页 -->
              <el-pagination
                layout="prev,pager,next"
                :total="total"
                :page-size="pagesize"
                :current-page="page"
                @current-change="changePage"
              > />
              </el-pagination></el-row>
          </el-tab-pane>

          <!-- 公司 -->
          <el-tab-pane label="公司管理" name="second">
            <!-- 提示 -->
            <el-alert
              :closable="false"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="warning"
              show-icon
            />
            <!--表单 -->
            <el-form label-width="80px" disabled style="margin-top: 30px;">
              <el-form-item label="企业名称" prop="name">
                <el-input v-model="companyForm.name" placeholder="xxx" style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址" prop="companyAddress">
                <el-input v-model="companyForm.companyAddress" placeholder="xxx" style="width:400px" />
              </el-form-item>
              <el-form-item label="公司电话" prop="companyPhone">
                <el-input v-model="companyForm.companyPhone" placeholder="xxx" style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱" prop="mailbox">
                <el-input v-model="companyForm.mailbox" placeholder="xxx" style="width:400px" />
              </el-form-item>
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="companyForm.remarks" placeholder="xxx" style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 新增角色的弹窗 -->
      <el-dialog :visible.sync="dialogVisible" :title="dialogName" @close="closePop">
        <el-form ref="roleForm" :model="role" :rules="roleRules" label-width="80px" style="margin-top: 30px;">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="role.name" style="width:400px" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="role.description" style="width:400px" />
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-button type="default" size="small" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-row>
      </el-dialog>
      <!-- 分配权限的弹窗 -->
      <el-dialog title="分配权限" :visible.sync="showAssignPerm" @close="closePerPop">
        <!-- 权限是一颗树 -->
        <!-- 将数据绑定到组件上 -->
        <!-- :show-checkbox="true" 是否显示复选框 -->
        <!-- check-strictly 如果为true，表示父子之间不互相关联;默认为false互相关联-->
        <!-- :default-checked-keys="selectCheck" 默认选中的节点 -->
        <!-- node-key="id" id作为唯一标识,注意前面不需要加冒号":" -->
        <el-tree
          ref="permTree"
          :data="permissionData"
          :props="props"
          show-checkbox
          default-expand-all
          :check-strictly="true"
          node-key="id"
          :default-checked-keys="permIds"
        />
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" @click="permOk">确定</el-button>
            <el-button type="default" @click="closePerPop">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, delRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      page: 1,
      pagesize: 10,
      total: 0,
      // 角色列表
      list: [
        {
          id: '',
          name: '',
          description: '',
          companyId: ''
        }
      ],
      // 公司信息
      companyForm: {},
      // 角色
      role: {
        name: '',
        description: ''
      },
      roleRules: {
        name: [
          { trigger: 'blur', required: true, message: '角色名称不能为空' }

        ]
      },
      dialogVisible: false, // 添加角色的弹窗显示
      showAssignPerm: false, // 分配权限的弹窗显示
      permissionData: [], // 权限列表
      // 树形 定义显示字段的名称和子属性的字段名称
      props: {
        label: 'name', // 让树形列表显示name里的值 默认是显示label里的其实
        children: 'children'
      },
      roleId: '', // 用来记录当前分配的角色的权限的id
      permIds: [] // 默认选中的权限点数据，就是当前角色所拥有的权限

    }
  },

  computed: {
    ...mapGetters(['companyId']),
    dialogName() {
      return this.role.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.handleGetRoleList()
    this.handleGetCompanyInfo()
  },
  methods: {
    // 获取公司角色列表
    async handleGetRoleList() {
      const re = await getRoleList({
        page: this.page,
        pagesize: this.pagesize
      })
      this.total = re.total
      this.list = re.rows
    },
    // 点击换页
    changePage(newPage) { // newPage是事件自带的当前页码
      this.page = newPage
      this.handleGetRoleList()
    },
    // 获取公司信息
    async  handleGetCompanyInfo() {
      const re = await getCompanyInfo(this.companyId)
      this.companyForm = re
    },
    // 点击删除
    async  delRole(id) {
      try {
        await this.$confirm('确定删除吗?') // 只有点击了确定 才能进入到下方
        await delRole(id)
        this.handleGetRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击修改角色,实现数据回写
    async  updateRole(id) {
      // id是row.id是当前点击的那行数据的id
      // 获取最新角色信息
      const re = await getRoleDetail(id)
      this.role = re // re里还有permIds
      this.dialogVisible = true // 为了避免闪烁问题 先获取数据再显示弹窗
    },
    // 新增角色时候点击确定
    async  btnOk() {
      // this.$refs.roleForm.validate((isOk) => {})// 写法一
      // this.$refs.roleForm.validate().then().catch()// 写法二
      // 写法三  trycatch包裹的async await
      try {
        await this.$refs.roleForm.validate() // 检验通过才执行下面的否则进入catch
        if (this.role.id) {
          // 编辑
          await updateRole(this.role)
        } else {
          // 新增
          await addRole(this.role)
        }
        this.handleGetRoleList() // 更新数据
        this.$message.success('操作成功')
        this.dialogVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭新增弹窗,点击取消/确定/×都会调用dialog的close事件
    closePop() {
      // 重置表单
      this.role = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()// 重置表单校验规则
    },
    // 点击分配权限按钮
    async assignPerm(id) {
      // 1.获取权限树形列表
      // 因为pid=0是根级访问权，1是子级操作权
      // 转化成了带children的树形结构
      this.permissionData = tranListToTreeData(await getPermissionList(), '0')
      // 2.获取当前角色权限
      // 把id记录下来 当你点击确定的时候是往哪个id里存那 点击确定时候接口用
      this.roleId = id
      const { permIds } = await getRoleDetail(id) // 根据ID获取角色详情
      // 得到权限点
      this.permIds = permIds

      this.showAssignPerm = true
    },
    // 分配权限点击确定
    async permOk() {
      // getCheckedKeys() 若节点可被选择，则返回目前被选中的节点的 key 所组成的数组
      this.permIds = this.$refs.permTree.getCheckedKeys()
      await assignPerm({
        id: this.roleId,
        permIds: this.permIds
      })
      this.showAssignPerm = false
      this.handleGetRoleList()
      this.$message.success('操作成功')
    },
    closePerPop() {
      this.permIds = []
      this.showAssignPerm = false
    }

  }
}
</script>

  <style scoped>

  </style>
