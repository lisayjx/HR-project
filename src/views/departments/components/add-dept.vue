<template>
  <el-dialog
    :title="deptName"
    :visible="dialogFormVisible"
    @close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="120px" :rules="formRules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model.trim="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model.trim="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model.trim="form.manager" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in people" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model.trim="form.introduce" type="textarea" rows="5" placeholder="1-300个字符" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDepartment, getDepartments, getDepartmentDetail, editDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    dialogFormVisible: {
      type: Boolean,
      required: true
    },
    node: {
      type: Object,
      default: null
    }

  },
  data() {
  /*  // 校验重复部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 同级子部门里的名字如果和当前输入的名字一样的话 不允许
      //   获取最新部门数据
      const { depts } = await getDepartments()
      //   找到所有同级子部门(找到平级的同事了的意思)
      const sameSonDepts = depts.filter(item => {
        return item.pid === this.node.id // 当前点击的节点的id
      })
      //   然后从同级子部门里找有没有和value一样的
      const isRepeat = sameSonDepts.some(item => {
        return item.name === value
      })
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }

    // 校验重复部门编码
    const checkCodeRepeat = async(rule, value, callback) => {
      // 同级子部门里的名字如果和当前输入的编码一样的话 不允许
      //   获取最新部门数据
      const { depts } = await getDepartments()
      //   找有没有和value一样的
      const isRepeat = depts.some(item => {
        // 要求编码和所有的部门编码都不能重复由于历史数据有可能没有code所以说这里加一个强制性条件就是value值不为空
        return item.code === value && value
      })
      isRepeat ? callback(new Error(`已经存在这个编码了`)) : callback()
    }
*/

    // 校验重复部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 同级子部门里的名字如果和当前输入的名字一样的话 不允许
      //   获取最新部门数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.form.id) { // 编辑
      //   找到所有同级子部门(找到除了我自己以外的平级的同事)
        const sameSonDepts = depts.filter(item => {
          return item.pid === this.node.id && item.id !== this.node.id
        })
        //   然后从同级子部门里找有没有和value一样的
        isRepeat = sameSonDepts.some(item => {
          return item.name === value
        })
      } else { // 新增
        //   找到所有同级子部门(平级的同事包括我自己)
        const sameSonDepts = depts.filter(item => {
          return item.pid === this.node.id
        })
        //   然后从同级子部门里找有没有和value一样的
        isRepeat = sameSonDepts.some(item => {
          return item.name === value
        })
      }
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }

    // 校验重复部门编码
    const checkCodeRepeat = async(rule, value, callback) => {
      // 同级子部门里的名字如果和当前输入的编码一样的话 不允许
      //   获取最新部门数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.form.id) {
        //   找有没有和value一样的(除了我自己)
        isRepeat = depts.some(item => {
        // 要求编码和所有的部门编码都不能重复由于历史数据有可能没有code所以说这里加一个强制性条件就是value值不为空
          return item.id !== this.node.id && item.code === value && value
        })
      } else {
        //   找有没有和value一样的
        isRepeat = depts.some(item => {
          return item.code === value && value
        })
      }
      isRepeat ? callback(new Error(`已经存在这个编码了`)) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        introduce: '',
        manager: ''
      },

      formRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 50, message: '1-50个字符' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 50, message: '1-50个字符' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '请输入部门管理员', trigger: 'blur' },
          { min: 1, max: 50, message: '1-50个字符' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 300, message: '1-300个字符' }
        ]
      },
      people: []

    }
  },
  computed: {
    deptName() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },

  methods: {
    // 点击确定
    submitForm() {
      // 如果校验成功
      this.$refs.form.validate(async isOk => {
        if (isOk) {
          if (this.form.id) { // 编辑
            await editDepartments(this.form)
          } else { // 新增
            // 请求提交表单 接口
            await addDepartment({
              ...this.form,
              pid: this.node.id// 调用新增接口 添加父部门的id
            })
          }

          this.$emit('closePop')
          this.$emit('addDepts')
        }
      })
    },
    // 点击×
    handleClose() {
      // 重置数据 变成这样 ，里面没有id
      this.form = {
        name: '',
        code: '',
        introduce: '',
        manager: ''
      }

      // 它只能重置data里定义的数据
      this.$refs.form.resetFields()
      this.$emit('closePop')
    },
    // 获取简单员工列表
    async  getEmployeeSimple() {
      this.people = await getEmployeeSimple()
    },
    // 点击取消
    cancel() {
      this.handleClose()
    },
    // 获取部门详情（为了编辑时候有显示数据）
    async   handleGetDepartmentDetail(id) {
      const re = await getDepartmentDetail(id)
      this.form = re
    }
  }
}
</script>

<style scoped  >

</style>
