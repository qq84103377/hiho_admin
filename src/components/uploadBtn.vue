<template>
  <li class="add_photo">
    <input @change="imgUpload" type="file" accept="image/png,image/jpeg,image/jpg,image/gif" :id="id"
           multiple>
    <label class="upload-file" :for="id">
      <i class="el-icon-plus" style="font-size: 30px;color: #B8B8C5;"></i>
    </label>
  </li>
</template>

<script>
  import {getPictureUploadToken, upDetailImgs} from '@/api/upload.js'
  import md5 from 'js-md5';

  const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
  import qiNiu from '@/utils/qiniu'

  export default {
    name: "upload-btn",
    props: {
      multiple: {
        type: Boolean,
        default: true
      },
      id: {
        type: String
      }
    },
    data() {
      return {
        fileList: []
      }
    },
    methods: {
      // 图片上传逻辑
      async imgUpload(e) {
        const file = e.target.files;
        if (!this.multiple && file.length > 1) {
          this.$message.error('请选择一张图片上传');
          return
        }
        if (file.length > 9) {
          this.$message.error('最多只能上传9张图片');
          return
        }
        console.log(file);
        for (let i = 0; i < file.length; i++) {
          if (file[i].size > 1000000) {
            this.$message({
              showClose: true,
              message: "图片大小超过1M!,重新上传",
              type: "error",
              // duration: config.elementUI.duration
            })
            return false
          }
          await getPictureUploadToken().then(res => {
            console.log(res.data);
            // this.img_name.token = res.data.uptoken
            var params2 = new FormData()
            params2.append("file", file[i])
            params2.append("token", res.data)
            params2.append("key", this.setImgKey())
            upDetailImgs(params2).then(result => {
              console.log(result);
              const _imgUrl = qiNiu.baseUrl + result.key
              this.fileList = [_imgUrl]
              // this.fileList.push(_imgUrl)
              this.$emit('uploadImg', this.fileList) // 触发父组件数据更改
            })
          })
        }
      },
      // md5图片上传Key的拼接
      setImgKey() {
        const storeId = this.$store.getters.userInfo.userId
        const date = +new Date() + '';
        return storeId + '_' + _env + '_' + md5(storeId + date);
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .add_photo {
    /*display: block;*/
    input {
      opacity: 0;
      position: absolute;
      width: 60px;
      z-index: -999999;
    }
    .upload-file {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      width: 100px;
      height: 100px;
      border: 1px dashed $inputBorder;
    }
  }
</style>
