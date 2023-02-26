<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 引入 pageTools组件 -->
    <page-tools :show-left="true">
      <!-- 左侧插槽 插槽新写法v-slot:插槽名 需要template包裹-->
      <template v-slot:left>
        <span>本月：社保在缴 公积金在缴 </span>
      </template>

      <!-- 右侧插槽 旧写法-->
      <el-button slot="right" type="primary">导入Excle</el-button>
    </page-tools>

    <!-- 导入excel组件 -->
    <UploadExcel />

    <!-- 导入全局组件 上传图片 -->
    <image-upload />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import pageTools from '@/components/PageTools'

export default {
  name: 'Dashboard',
  components: { },
  computed: {
    ...mapGetters([
      'name'
    ])
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
