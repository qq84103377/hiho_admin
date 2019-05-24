<template>
  <div>
    <!--新建品牌侧边栏-->
    <transition name="right-move">
      <div class="user-guide-pop" v-if="popShow">
        <div class="pop-head">
          <div class="title">{{editInfo.guideId?'编辑':'新建'}}说明</div>
          <div class="btn-group">
            <el-button size="medium" @click="popHide">取消</el-button>
            <el-button :loading="btnLoading" size="medium" type="primary" @click="confirm">确定</el-button>
          </div>
        </div>
        <el-form :model="editInfo" :rules="rules" ref="userGuide" label-width="84px"
                 class="pop-main">
          <el-form-item label="说明标题:" prop="title">
            <el-input v-model.trim="editInfo.title" placeholder="请输入说明标题"></el-input>
          </el-form-item>
          <el-form-item label="说明内容:" prop="answer">
            <UE :defaultMsg=defaultMsg :config=config id=ue1 ref="ue"></UE>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="previewH5=true;editInfo.answer=$refs.ue.getUEContent()">
              预览效果
            </el-button>
          </el-form-item>
        </el-form>

        <!--预览效果-->
        <preview :show.sync="previewH5" :title="editInfo.title" :content="editInfo.answer"></preview>
      </div>
    </transition>
    <transition name="opcity">
      <div class="cover" v-if="popShow" @click="popHide">
      </div>
    </transition>
  </div>
</template>


<script>
  import UE from '../../components/ue';
  import preview from '../common/previewH5'
  import {saveGuide} from '@/api/setting'

  export default {
    components: {UE, preview},
    props: {
      editInfo: {
        type: Object
      },
      popShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        btnLoading: false,
        previewH5: false,
        defaultMsg: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 375,
          zIndex: 1
        },
        rules: {
          answer: [
            {required: true, message: '请填写说明内容'},
          ],
          title: [
            {required: true, message: '请填写说明标题', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
    },
    methods: {
      confirm() {
        this.editInfo.answer = this.$refs.ue.getUEContent()
        this.$refs['userGuide'].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            saveGuide(this.editInfo).then(res => {
              this.btnLoading = false
              if (res.code == 0) {
                this.$emit('confirm')
                this.popHide()
                this.$message.success(this.editInfo.guideId ? '修改成功' : '新建成功')
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
      popHide() {
        this.$emit('update:popShow', false)
      },
    },
    watch: {
      popShow(v) {
        if (v) {
          if (this.editInfo.guideId) {
            this.defaultMsg = this.editInfo.answer
          } else {
            this.defaultMsg = ''
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

  .user-guide-pop {
    height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    width: 750px;
    background: #fff;
    z-index: 101;
    color: $sysBlack;
    overflow-y: auto;
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
