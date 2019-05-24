<template>
  <div>
    <!--新建品牌侧边栏-->
    <transition name="right-move">
      <div class="add-brand-pop" v-if="popShow">
        <div class="pop-head">
          <div class="title">{{isEdit?'编辑':'新建'}}品牌</div>
          <div class="btn-group">
            <el-button size="medium" @click="popHide">取消</el-button>
            <el-button :loading="btnLoading" size="medium" type="primary" @click="confirm">确定</el-button>
          </div>
        </div>
        <el-form :model="params" :rules="rules" ref="brand" label-width="84px"
                 class="pop-main">
          <el-form-item label="品牌名称:" prop="name">
            <el-input v-model.trim="params.name" placeholder="请输入品牌名称"></el-input>
          </el-form-item>
          <el-form-item label="运费模板:" prop="freightTempleteId">
            <el-select clearable v-model="params.freightTempleteId" placeholder="请选择运费模板">
              <el-option
                v-for="item in template"
                :key="item.freightTempleteId"
                :label="item.freightTempleteName"
                :value="item.freightTempleteId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌LOGO:">
            <pic-list :isCover="false" @delImg="uploadImg" :fileList="params.logo?[params.logo]:[]">
              <upload-btn :multiple="false" slot="upload" @uploadImg="uploadImg" id="1"></upload-btn>
            </pic-list>
          </el-form-item>
          <el-form-item label="品牌介绍:" prop="remark">
            <el-input
              v-model="params.remark"
              style="width: 606px;"
              type="textarea"
              :rows="4"
              placeholder="请输入品牌介绍内容">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </transition>
    <transition name="opcity">
      <div class="cover" v-if="popShow" @click="popHide">
      </div>
    </transition>
  </div>
</template>

<script>
  import {saveBrand, showBrand} from '@/api/brand.js'
  import {getSimpleList} from '@/api/goods.js'

  export default {
    props: {
      popShow: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        btnLoading: false,
        template: [],
        params: {
          remark: '',
          logo: '',
          name: '',
          userId: this.$store.getters.userInfo.userId,
          id: '',
          freightTempleteId: ''
        },
        rules: {
          freightTempleteId: [
            {required: true, message: '请选择运费模板', trigger: 'change'},
          ],
          name: [
            {required: true, message: '请填写品牌名称', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      getSimpleList().then(res => {
        this.template = res.data.freightTempleteList
      })
    },
    methods: {
      confirm() {
        this.$refs['brand'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            saveBrand(this.params).then(res => {
              this.btnLoading = false
              if(res.code==0){
                this.$message.success(this.isEdit?'编辑成功':'新建成功')
                this.$emit('confirm')
                this.popHide()
              }else {
                this.$Message.error(res.msg)
              }
            })
          }
        })
      },
      popHide() {
        this.$emit('update:popShow', false)
      },
      uploadImg(v) {
        console.log(v, '品牌图片');
        this.params.logo = v.length ? v[0] : ''
      }
    },
    watch: {
      popShow(v) {
        if (!v) {
          this.params = {
            remark: '',
            logo: '',
            name: '',
            userId: this.$store.getters.userInfo.userId,
            id: '',
            freightTempleteId: ''
          }
        } else {
          if (this.isEdit) {
            let params = {brandId: this.$route.query.brandId}
            showBrand(params).then(res => {
              this.params = res.data
            })
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .cover {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .add-brand-pop {
    height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    width: 750px;
    background: #fff;
    z-index: 101;
    color: $sysBlack;
    .pop-head {
      padding: 32px 32px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $divideBorder;
      .title {
        font-size: 24px;
      }
    }
    .pop-main {
      padding: 24px 32px;
      /*.label-group {*/
      /*margin-bottom: 16px;*/
      /*width: 100%;*/
      /*display: flex;*/
      /*.label-title {*/
      /*align-items: center;*/
      /*width: 80px;*/
      /*margin-right: 10px;*/
      /*text-align: right;*/
      /*display: inline-block;*/
      /*}*/
      /*}*/
    }
  }
</style>
