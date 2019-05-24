<template>
  <div class="brand-detail">
    <content-wrap title="品牌主页">
      <el-button slot="btn" @click="$router.back(-1)">返回</el-button>
      <div class="content-head">
        <div class="brand-logo">
          <img :src="brandInfo.logo" alt="">
        </div>
        <div class="brand-desc">
          <div class="brand-head">
            <div class="title">{{brandInfo.name}}</div>
            <div class="btn-group">
              <el-button class="iconfont icon-delete" style="color: #F83149;border-color: #F83149;" size="medium"
                         @click="dialogVisible = true"> 删除
              </el-button>
              <el-button class="iconfont icon-edit" size="medium" @click="editBrandPop = true"> 编辑</el-button>
            </div>
          </div>
          <div class="brand-content">{{brandInfo.remark}}
          </div>
        </div>
      </div>
    </content-wrap>
    <div style="background: #fff;margin-top: 16px; position:relative">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="`品牌商品(${totalNum})`" name="goodsList">
            <el-row style="padding: 0 32px 32px;">
              <good-list :brandId="$route.query.brandId" @count="count" ref="goodsList"></good-list>
            </el-row>
          </el-tab-pane>
          <el-tab-pane :label="`品牌活动(${activityTotal})`" name="activity">
            <el-row style="padding: 0 32px 32px;">
              <activity-list v-loading="activityLoading" @handleCurrentChange="v => getActivityList(v)" :tableData="activityData"
                     :totalCount="activityTotal" :pageSize="20"></activity-list>
            </el-row>
          </el-tab-pane>
          <el-tab-pane :label="`关注此品牌的用户(${totalCount})`" name="userList">
            <el-row style="padding: 0 32px 32px;">
              <user-list @handleCurrentChange="v => getUserListFn(v)" v-loading="loading" :tableData="userTableData" :totalCount="totalCount" :pageSize="20"></user-list>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <el-button v-if="activeName=='goodsList'" class="action-btn posA" size="medium" style="font-size: 14px;" type="primary"
                   @click="$router.push({path:'/goodsEdit',query:{brandId:$route.query.brandId}})">新建商品
        </el-button>
    </div>

    <el-dialog
      title="确定删除该品牌?"
      :visible.sync="dialogVisible"
      width="30%">
      <!--<span>这是一段信息</span>-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button :loading="btnLoading" type="primary" @click="delBrand">确 定</el-button>
  </span>
    </el-dialog>

    <!--编辑品牌侧边栏-->
    <brand-pop @confirm="confirm" :isEdit="true" :popShow.sync="editBrandPop"></brand-pop>
  </div>
</template>
<script>
  import {showBrandDetail, deleteBrand} from '@/api/brand.js'
  import { getUserList } from '@/api/user.js'
  import {listActivity} from '@/api/activity.js'
  import activityList from '../../activity/components/activity-list.vue'
  import goodList from '../components/good-list.vue'
  import userList from '../../user/customer/components/user-list.vue'

  export default {
    name: 'brandDetail',
    components: {activityList,goodList,userList},
    data() {
      return {
        btnLoading: false,
        dialogVisible: false,
        brandInfo: {},
        editBrandPop: false,
        totalNum: 0,
        totalNum1: 0,
        curPath: '',
        activeName: 'goodsList',
        curKey: 'goodsList',
        totalCount: 0,
        loading:false,
        userTableData:[],
        activityLoading:false,
        activityData: [],
        activityTotal:0
      }
    },
    created() {
      this.getBrandInfo()
      this.getUserListFn(1)
      this.getActivityList(1)
    },
    methods: {
    // 获取活动列表
      getActivityList(num) {
        console.log(this.$route.query.brandId)
        this.activityLoading = true
        let params = {
          brandFilter: this.$route.query.brandId,
          pageNum: num || 1,
          pageSize: 20,
          sortBy: 'createAt',
          sortType: '1',
        }
        listActivity(params).then(res => {
          this.activityLoading = false
          this.activityData = res.data.activities
          this.activityTotal = res.data.totalCount
        })
      },
      // 获取关注用户列表
      getUserListFn(num) {
        this.loading = true
        let params = {
          keyword: '',
          levelFilter: '',
          hasWxFilter: '',
          orderFilter: '',
          createAtStartFilter: '',
          createAtEndFilter: '',
          pageNum: num || 1,
          pageSize: 20,
          sortBy: 'createAt',
          sortType: '1',
          brandIds: [this.$route.query.brandId],
        }
        console.log(params,'筛选参数');
        getUserList(params).then(res => {
          console.log(res);
          this.loading = false
          this.totalCount = res.data.totalCount
          this.userTableData = res.data.users
        })
      },
      count(v) {
        this.totalNum = v
        console.log(v,'this.totalNum')
      },
      total(v) {
        this.totalNum1 = v
        console.log(this.totalNum,'this.totalNum')
      },
      delBrand() {
        this.btnLoading = true
        let params = {brandId: this.$route.query.brandId}
        deleteBrand(params).then(res => {
          this.btnLoading = false
          if(res.code==0){
            this.$message.success('删除成功')
            this.$router.go(-1)
          }else {
            this.$message.error(res.msg)
          }
        })
      },
      confirm() {
        this.getBrandInfo()
      },
      handleSelect(key, keyPath) {
        this.curKey = key
      },
      getBrandInfo() {
        let params = {brandId: this.$route.query.brandId}
        showBrandDetail(params).then(res => {
          this.brandInfo = res.data
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .brand-detail {
    color: $sysBlack;
    .content-head {
      padding: 24px 0;
      display: flex;
      .brand-logo {
        border: 1px solid $imgBorder;
        width: 120px;
        height: 120px;
        display: inline-block;
        margin-right: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .brand-desc {
        width: 100%;
        .brand-head {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
          .title {
            width: 700px;
            font-size: 24px;
            line-height: 36px;
          }
        }
        .brand-content {
          font-size: 14px;
        }
      }
    }
    .icon-edit::before {
      color: $functionText;
    }
    .posA{
      position: absolute;
      right:32px;
      top:10px;
    }
  }

</style>
