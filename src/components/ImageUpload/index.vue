<template>
  <div>
    <!-- file-list是上传的文件列表可以绑定到上传组件上，让上传组件来显示-->
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :limit="1"
      :file-list="fileList"
      :class="{disabled: fileComputed }"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress
      v-if="showPercent"
      :text-inside="true"
      :stroke-width="14"
      :percentage="percent"
      status="success"
      :show-text="true"
      style="width:150px"
    />
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>

  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'// 引入腾讯云cos包
var cos = new COS({
  SecretId: 'AKIDnSwEG3czA7uVt45V3XspZ8SaZP2WmnfR', // 身份识别 ID
  SecretKey: 'gBUilaApKzYxA9vSq1xkV7Vu7D0e9Wnu' // 身份密钥
})
export default {

  name: '',
  data() {
    return {
      fileList: [
        // { url: 'xxx' }
      ], // 图片地址设置为数组
      dialogImageUrl: '',
      dialogVisible: false, // 控制显示弹层
      currentFileUid: null, // 记录当前正在上传的图片的uid
      percent: 0, // 进度条进度 当前的百分比
      showPercent: false// 进度条显示与隐藏
    }
  },
  computed: {
  // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击删除
    handleRemove(file, fileList) {
      // file要删除的文件，fileList删除过的文件也就是当前最新数组，this.fileList是存储图片的地方
      this.fileList = this.fileList.filter(item => {
        return item.uid !== file.uid
      })
    },
    // 点击预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传图片这个函数会执行两次，所以不能用push
    changeFile(file, fileList) {
      // file当前上传的图, fileList最新数组
    //   这种做法也不对
    //   if (!this.fileList.some(item => item.uid === file.uid)) {
    //     this.fileList.push(file)
    //   }

      this.fileList = fileList.map(item => item)
    },
    // 上传之前检查
    beforeUpload(file) {
      // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024 // 我们限制大小位5M，1M=1024KB,1KB=1024B，变成了B为单位的 最大是这么些B
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      //   显示进度条
      this.showPercent = true
      //   如果都通过了
      // 当校验通过之后切记一定要return true 放行，允许上传
      return true

    //   进度条
    },

    // 上传
    upload(params) {
      if (params.file) {
        //  上传
        cos.putObject({
          Bucket: 'project01-1317015722', // 自己存储桶名称
          Region: 'ap-shanghai', // 地域
          Key: params.file.name, // 唯一标识，可以是文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => { // 成功失败都会进入到这里,这里是箭头函数 因为下面会用到this
          // data返回数据之后 应该如何处理
          console.log(err || data)
          //   data.Location线上地址,this.fileList才能显示到上传组件上
          if (!err && data.statusCode === 200) { // 上传成功
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) { // 如果找到了当前对象
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              //   如果没找到
              return item
            })
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图 chang事件
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
