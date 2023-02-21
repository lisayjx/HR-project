<template>

  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">

      <!-- 左 -->
      <el-col>
        <div v-if="showLeft" class="left">
          <i class="el-icon-info" />
          <!-- 左侧插槽 -->
          <slot name="left" />
        </div>
      </el-col>

      <!-- 右 -->
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 右侧插槽 -->
          <slot name="right" />
        </el-row>
      </el-col>

    </el-row>
  </el-card>

</template>

<script>
export default {
  name: 'PageTools',
  components: {},
  props: {
    showLeft: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {}
}
</script>

<style lang="scss">
.page-tools {
    margin: 10px 0;
    .left {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
