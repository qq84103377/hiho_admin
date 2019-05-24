<template>
  <div class="market-detail">
    <content-wrap title="营销消息详情">
      <div slot="btn">
        <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      </div>
    </content-wrap>
    <div class="content">
      <div class="box">
        <div class="header fs18">营销信息</div>
        <el-button size="medium" @click="getCancel" v-if="form.status == 0"><i class="iconfont icon-icon-recall" style="margin-right:3px;"></i>撤销</el-button>
      </div>
      <div class="content-form">
        <el-form :model="form" label-width="100px" class="form form-readonly">
          <el-row>
            <el-col :span="10">
              <el-form-item label="营销主题：">
                <div>{{form.title}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="营销类别：">
                <div>{{typeMap[form.type]}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="营销海报：">
           <pic-list :fileList="[form.pic]" class="img" :isEdit="false" :isCover="false" ></pic-list>
          </el-form-item>
          <el-form-item label="营销链接：" v-if="form.type !== 'NOTICE'">
            <div>{{form.activityName?form.activityName : form.brandName}}</div>
          </el-form-item>
          <el-form-item label="推送时间：">
            <div>{{form.pushAt}}</div>
          </el-form-item>
          <el-form-item label="推送形式：">
            <div>应用内推送</div>
          </el-form-item>
        </el-form>
        <div :class="['fs18 bold', form.status == '1' ? 'auxiliaryText': '']">{{statusMap[form.status]}}</div>
      </div>
      
    </div>
  </div>
</template>
<script>
import {getMarketManageDetail, cancelMarketManage} from '@/api/market.js'
export default {
  name: 'market-detail',
  data () {
    return {
      form: {},
      typeMap:{'ACTIVITY': '活动','BRAND':'品牌','NOTICE':'公告'},
      statusMap:{'0': '未开始','1':'已撤销','2':'已完成'},
    }
  },
  methods: {
    getCancel () {
      let params ={
        id: this.form.id
      }
      cancelMarketManage(params).then(res => {
        this.$message.success(res.msg)
        this.getDate()
      })
    },
    getDate () {
      let params = {
        id: this.$route.query.id
      }
      getMarketManageDetail(params).then(res=>{
        this.form = res.data
      })
    }
  },
  created(){
    this.getDate()
  }
  
}
</script>
<style lang="scss" scoped>
 @import 'src/styles/variables.scss';
.market-detail{
  .content{
    background-color: #fff;
    .box{
      display:flex;
      justify-content: space-between;
      padding:18px 32px;
      border-bottom:1px solid $divideBorder;
      .header{
        line-height: 36px;
      }
    }
    .content-form{
      padding:24px 0;
      display: flex;
      justify-content: space-between;
      padding-right:32px;
      .form{
        width:800px;
        max-width:800px;
      }
      .bold{
        font-weight:600;
      }
    }
  }
}
</style>

