<template>
  <div class="customer-detail">
    <content-wrap title="注册用户详情">
      <el-button slot="btn" @click="$router.back()">返回</el-button>
      <div class="content-head">
        <div class="content-title">用户信息</div>
        <div class="content-main clearfix">
          <img
            :src="userInfo.vipLevel=='游客'?require('../../../assets/pic_visitor.png'):userInfo.headImg"
            alt="">
          <div class="label-group">
            <div>昵称: {{userInfo.name}}</div>
            <div>手机号码: {{userInfo.phone}}</div>
          </div>
          <div class="label-group">
            <div>用户等级: <span :class="['badge',{'visitor':userInfo.vipLevel=='游客'}]">{{userInfo.vipLevel}}</span></div>
            <div>关联微信: {{userInfo.wx?'已关联':'未关联'}}</div>
          </div>
        </div>
      </div>
    </content-wrap>
    <div style="padding: 0 32px 32px;" class="content-head">
      <div class="content-title main"><span>邀请码</span>
        <el-button v-if="userInfo.vipLevel!='游客'" @click="$refs.pop.codePopShow()">新增邀请码</el-button>
      </div>
      <el-table
        v-if="userInfo.vipLevel!='游客'"
        border
        :data="userInfo.codes"
        style="width: 100%;border: 1px solid #ebeef5;border-bottom: none;margin-top: 16px;"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column
          prop="code"
          label="邀请码"
        >
        </el-table-column>
        <el-table-column
          prop="ownerUserName"
          label="所属用户"
          width="149">
        </el-table-column>
        <el-table-column
          prop="status"
          label="使用状态"
          width="149">
          <template slot-scope="scope">
            <div>{{scope.row.status=='1'?'已使用':'未使用'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="邀请用户"
          width="149">
          <template slot-scope="scope">
            <div class="invite-user">
              <span @click="inviteUserLink(scope.row.applyUserId)">{{scope.row.applyUserName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="生成方式"
          width="149">
          <template slot-scope="scope">
            <div>{{scope.row.type=='1'?'手动生成':'系统生成'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createAt"
          label="生成时间"
          width="180">
        </el-table-column>
      </el-table>
      <div v-else class="visitor-tip">游客无增加邀请码权限</div>
    </div>

    <!--新增邀请码-->
    <create-code-pop v-if="userInfo.vipLevel!='游客'" @close="getUserInfo" ref="pop"></create-code-pop>
  </div>
</template>

<script>
  import {getUserDetail, judgeInviteCode, getVipList, getUserList, addInviteCode} from '@/api/user.js'

  export default {
    name: 'customerDetail',
    data() {
      return {
        code: '',
        level: '',
        user: '',
        userInfo: {},
        options: {
          level: [],
          user: []
        }
      }
    },
    methods: {
      inviteUserLink(id) {
        this.$router.replace({path: '/userDetail', query: {id: id}})
        this.getUserInfo()
      },
      getUserInfo() {
        let params = {id: this.$route.query.id}
        getUserDetail(params).then(res => {
          this.userInfo = res.data
          console.log(this.userInfo);
        })
      }
    },
    created() {
      this.getUserInfo()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .customer-detail {
    color: $sysBlack;
    .content-head {
      background: #fff;
      margin-bottom: 16px;
      .content-title {
        font-size: 18px;
        padding: 18px 0;
        border-bottom: 1px solid $divideBorder;
      }
    }
    .content-main {
      padding: 24px 0;
      img {
        width: 56px;
        height: 56px;
        margin-right: 24px;
        float: left;
      }
      .label-group {
        font-size: 14px;
        width: 280px;
        float: left;
        line-height: 28px;
      }
      .badge {
        display: inline-block;
        width: 50px;
        line-height: 28px;
        text-align: center;
        font-size: 14px;
        color: $sysGolden;
        background: $sysBlack;
        &.visitor {
          background: #EBEBF2;
          color: $auxiliaryText;
        }
      }
    }
    .main {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .invite-user {
      > span:hover {
        cursor: pointer;
        border-bottom: 1px solid $sysBlack;
      }
    }
    .visitor-tip {
      color: $placeholderText;
      font-size: 14px;
      text-align: center;
      padding-top: 32px;
    }
  }
</style>
