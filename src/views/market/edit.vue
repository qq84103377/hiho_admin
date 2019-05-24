<template>
  <div class="market-edit">
    <content-wrap title="新建营销消息">
      <div slot="btn">
        <el-button @click="$router.back()" size="medium">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogVisible = true" size="medium">确定</el-button>
      </div>
    </content-wrap>
    <div class="content">
      <div class="header fs18">营销信息</div>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm form">
        <el-form-item label="营销主题:" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="营销类别:" prop="type">
          <el-radio-group v-model="form.type" @change="change">
            <el-radio :label="'ACTIVITY'">活动推广</el-radio>
            <el-radio :label="'BRAND'">品牌推广</el-radio>
            <el-radio :label="'NOTICE'">公告</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="营销海报:" prop="pic">
          <pic-list text="支持 1M 以内JPG、PNG格式的图片" @delImg="uploadImg" :isCover="false" :fileList="imgList">
            <upload-btn slot="upload" :multiple="false" @uploadImg="uploadImg" id="1"></upload-btn>
          </pic-list>
        </el-form-item>
        <transition name="fade">
          <el-form-item label="营销链接:" v-if="form.type !== 'NOTICE'" prop="referId">
            <el-select v-model="form.referId" v-if="form.type === 'ACTIVITY'" placeholder="请选择活动 " clearable filterable>
              <el-option
                v-if="form.type === 'ACTIVITY'"
                v-for="item in activityList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-else-if="form.type === 'BRAND'" v-model="form.referId" placeholder="请选择品牌 " clearable
                       filterable>
              <el-option
                v-for="e in brandList"
                :key="e.id"
                :label="e.name"
                :value="e.id">
              </el-option>
            </el-select>
          </el-form-item>
        </transition>
        <el-form-item label="推送时间:" prop="pushAtStamp">
          <el-date-picker
            v-model="form.pushAtStamp"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推送形式:">
          <el-radio-group v-model="num">
            <el-radio :label="4">应用内推送</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="确认推送？"
      :visible.sync="dialogVisible"
      top="20%"
      width="30%"
      :center="true">
      <div style="text-align:center;">若是立即推送的消息将不可撤销，确认吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {saveMarketManage} from '@/api/market.js'
  import {listActivity} from '@/api/activity.js'
  import {listBrand} from '@/api/brand.js'

  export default {
    name: 'marketEdit',
    data() {
      return {
        rules: {
          title: [
            {required: true, message: '营销主题不可为空', trigger: 'change'}
          ],
          type: [
            {required: true, message: '营销类别不可为空', trigger: 'blur'}
          ],
          pic: [
            {required: true, message: '营销海报不可为空', trigger: 'change'}
          ],
          pushAtStamp: [
            {required: true, message: '推送时间不可以为空', trigger: 'change'}
          ],
          referId: [
            {required: true, message: '推送链接不可以为空', trigger: 'change'}
          ]
        },
        form: {
          title: '',
          type: 'ACTIVITY',
          pic: '',
          referId: '',
          pushAtStamp: ''
        },
        num: 4,
        activity: '',
        brand: '',
        imgList: [],
        dialogVisible: false,
        activityList: [],
        brandList: [],
        btnLoading: false
      }
    },
    methods: {
      change() {
        this.form.referId = ''
      },
      uploadImg(v) {
        this.form.pic = v.length ? v[0] : ''
        this.imgList = v.length ? [this.form.pic] : []
        console.log(this.imgList, '合成图片');
      },
      getActivityList(num) {
        let params = {
          pageNum: 0,
          pageSize: 0
        }
        listActivity(params).then(res => {
          this.activityList = res.data.activities
        })
      },
      // 品牌
      getBrandList() {
        let params = {
          keyword: '',
          pageNum: 0,
          pageSize: 0
        }
        listBrand(params).then(res => {
          console.log(res, '品牌列表')
          this.brandList = res.data.brandOneResponseList
        })
      },
      save() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if ((this.form.pushAtStamp + 300000) < new Date().getTime()) {
              return this.$message.error('当前已超过5分钟，请重新设置推送时间')
            }
            this.btnLoading = true
            this.form.pushAtStamp = this.form.pushAtStamp / 1000
            let params = {
              ...this.form
            }
            saveMarketManage(params).then(res => {
              this.btnLoading = false
              if(res.code==0){
                this.$message.success(res.msg)
                this.dialogVisible = false
                this.$router.back()
              }else {
                this.$message.error(res.msg)
              }
            })
          }
        });


      }
    },
    created() {
      this.getActivityList()
      this.getBrandList()
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .market-edit {
    .content {
      background-color: #fff;
      .header {
        height: 60px;
        line-height: 60px;
        padding-left: 32px;
        border-bottom: 1px solid $divideBorder
      }
      .form {
        padding: 24px 0;
      }
    }
  }
</style>
<style lang="scss">
  @import 'src/styles/variables.scss';

  .market-edit {
    .el-radio__input.is-checked + .el-radio__label {
      color: #606266
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: $sysBlack;
      background: $sysBlack;
    }
    .el-radio__inner:hover {
      border-color: #3E3E3F
    }
    .el-form-item__label {
      color: $sysBlack;
      font-weight: 400;
    }
  }
</style>
