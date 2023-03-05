<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 这里必须加一个div -->
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="this.$i18n.locale==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="this.$i18n.locale==='en'">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {

  components: {},

  data() {
    return {

    }
  },

  methods: {
    changeLanguage(command) {
      // 设置的类型 先写入到cookie
      Cookie.set('language', command) // 写入缓存
      //   改变当前的多语言

      this.$i18n.locale = command // 将当前多语言类型改成对应的
      this.$message.success('切换成功')
    }
  }
}
</script>

<style scoped lang="less">

</style>
