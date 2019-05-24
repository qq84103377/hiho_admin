<template>
  <div class="after-sales-detail">
    <content-wrap title="售后单详情">
      <el-button slot="btn" @click="$router.go(-1)">返回</el-button>
    </content-wrap>
    <div class="setp mgb16">
      <div class="setp-header fs18">售后单状态</div>
      <div v-if="detailInfo.refundType == 'MONEY_ONLY'">
        <el-steps :active="step" align-center class="setp-content" finish-status="finish">
          <el-step v-for="(item,index) in onlyMoneyStepData">
            <div :class="{'sysDarkGreen':item.title == '平台同意退款','sysRed':item.title == '退款失败' ||item.title =='平台拒绝退款' }" slot="title">{{item.title}}</div>
            <div slot="icon">
              <span v-if="step == index" class="setp-icon" :class="{'error':item.title =='平台拒绝退款' || item.title =='退款失败'}">
                <span  v-if="item.title =='平台拒绝退款' || item.title =='退款失败'" class="el-icon-close fs18 lh32"></span>
                <span v-else-if="step === onlyMoneyStepData.length-1" class="el-icon-check fs18 lh32"></span>
                <span v-else>{{step+1}}</span>
              </span>
              <span v-else class="setp-radius"></span>
            </div>
            <div slot="description">
              <span class="auxiliaryText">{{item.time}}</span>
              <el-button @click="confirmRefund" v-if="detailInfo.refundStatus == 'FAIL' &&item.title == '退款失败'" type="danger" size="small">重新发起</el-button>
            </div>
          </el-step>
        </el-steps>
      </div>
      <div v-else>
        <el-steps :active="step" align-center class="setp-content" finish-status="finish">
          <el-step v-for="(item,index) in goodsMoneyStepData">
            <div :class="{'sysDarkGreen':item.title == '平台同意申请','sysRed':item.title == '退款失败' || item.title =='平台拒绝申请' }" slot="title">{{item.title}}</div>
            <div slot="icon">
              <span v-if="step == index" class="setp-icon" :class="{'error':item.title =='平台拒绝申请' || item.title =='退款失败'}">
                <span  v-if="item.title =='平台拒绝申请' || item.title =='退款失败'" class="el-icon-close fs18 lh32"></span>
                <span v-else-if="step === goodsMoneyStepData.length-1" class="el-icon-check fs18 lh32"></span>
                <span v-else>{{step+1}}</span>
              </span>
              <span v-else class="setp-radius"></span>
            </div>
            <div slot="description">
              <span class="auxiliaryText">{{item.time}}</span>
              <el-button @click="confirmRefund" v-if="detailInfo.refundStatus == 'FAIL'&&item.title == '退款失败'" type="danger" size="small">重新发起</el-button>
            </div>
          </el-step>
        </el-steps>
      </div>
    </div>
    <div class="setp">
      <div class="setp-header">售后单信息</div>
      <div class="pdlr32 pdb40">
        <div class="pay-status borderB">
          <span class="pay-titile">退款申请：{{detailInfo.refundType == 'MONEY_ONLY'?'仅退款':'退货退款'}}</span>
          <el-form label-position="left" label-width="70px" class="form-readonly mgt16">
            <el-row>
              <el-col :span="8">
                <el-form-item label="售后单号：">
                  <span>{{detailInfo.refundOrderNum}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请时间：">
                  <span>{{detailInfo.applyAt}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="退款金额：">
                  <span class="sysRed">￥{{detailInfo.refundAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="关联订单：">
                  <el-button @click="$router.push({path:'/salesDetail',query:{id:detailInfo.orderId}})" class="sysBlue order-detail-btn" type="text">{{detailInfo.orderNum}}</el-button>
                  <!--<span class="sysBlue">{{detailInfo.orderNum}}</span>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="申请用户：">
                  <span class="sysBlue">{{detailInfo.userName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式：">
                  <span>{{detailInfo.phone}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            border
            :data="goodsSpecsDetail"
            style="width: 800px;margin-top: 10px;">
            <template v-for="e in cols">
              <el-table-column
                v-if="e.prop == 'imageUrl'"
                :prop="e.prop"
                :width="e.width"
                :label="e.label">
                <template slot-scope="scope">
                  <div style="display: flex; align-items: center;">
                    <img style="width: 40px;height: 40px;margin-right: 12px;" :src="scope.row.imageUrl" alt="商品图片">
                    <div>
                      <p>{{ scope.row.goodsStyleNo }}</p>
                      <p class="auxiliaryText">{{ scope.row.goodsName }}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="e.prop == 'refundType'"
                :prop="e.prop"
                :width="e.width"
                :label="e.label">
                <template slot-scope="scope">
                  <div v-if="scope.row.refundType">
                    <p class="sysDarkGreen">买家申请{{scope.row.refundType === 'MONEY_ONLY:'? '仅退款':'退款退货'}}</p>
                    <p style="color: #9898A1">售后单号：{{scope.row.refundOrderNum}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :prop="e.prop"
                :width="e.width"
                :label="e.label">
              </el-table-column>
            </template>
          </el-table>
        </div>

        <div class="pay-status borderB">
          <span class="pay-titile mgr16">平台审核</span>
          <span :class="{'sysRed':detailInfo.refundStatus=='FAIL' || detailInfo.refundStatus=='WAIT_AGREE' || detailInfo.refundStatus=='WAIT_RECIVE_GOODS',
          'auxiliaryText':detailInfo.refundStatus=='CANCEL' || detailInfo.refundStatus=='REFUSED',
          'sysDarkGreen':detailInfo.refundStatus=='SUCCESS'}">{{ changeOrderStatus(detailInfo.refundStatus)}}</span>

          <el-form style="width: 700px" v-if="detailInfo.refundStatus == 'FAIL' || detailInfo.refundStatus == 'SUCCESS'" label-position="left" label-width="70px" class="form-readonly mgt16">
            <el-row>
              <el-col :span="8">
                <el-form-item label="退款流水：">
                  <span>{{detailInfo.payNum}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="退款状态：">
                  <span :class="{'sysRed':detailInfo.refundStatus=='FAIL'}">{{changeOrderStatus(detailInfo.refundStatus)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-button @click="confirmRefund" class="float-right" v-if="detailInfo.refundStatus == 'FAIL'" type="danger" size="small">重新发起</el-button>
              </el-col>
            </el-row>
          </el-form>

          <div v-if="detailInfo.refundStatus=='REFUSED'" class="refused-content mgt8">
            拒绝原因：{{ detailInfo.refuseReason }}
          </div>

          <div style="width: 700px" class="bg-color fs14 mgt8 pdt16 pdl16">
            <p class="borderB pdb8">退款原因：{{detailInfo.refundReason}}</p>
            <p class="auxiliaryText pdt8">{{detailInfo.refundNote}}</p>
            <pic-list class="mgt8" v-show="detailInfo.refundPicList&&detailInfo.refundPicList.length>0" :isEdit="false" :fileList="detailInfo.refundPicList"></pic-list>
          </div>
        </div>
        <div style="width: 700px"  v-if="detailInfo.refundType == 'MONEY_GOODS' && isAgreeRefund(detailInfo.refundStatus)" class="pay-status">
          <span class="fs16 pay-titile mgr16">退货状态</span>
          <span :class="{'sysRed':detailInfo.refundStatus=='WAIT_RECIVE_GOODS','color-gray':detailInfo.refundStatus=='WAIT_RETUEN_GOODS'}">{{getRefundStatus(detailInfo.refundStatus)}}</span>
          <p class="fs14 mgt16" v-if="detailInfo.refundStatus=='WAIT_RECIVE_GOODS' || detailInfo.refundStatus=='SUCCESS' || detailInfo.refundStatus=='FAIL' || detailInfo.refundStatus=='REFUSED'">{{detailInfo.logisticsCompany}}：{{detailInfo.logisticsNum}}</p>
          <div style="width: 700px" class="bg-color pd16 mgt16">
            <p class=" fs14 lh20 mgb8">
              <span class="pdr60">收货人：{{detailInfo.receiverName}}</span>
              <span>联系方式：{{detailInfo.receiverPhone}}</span>
            </p>
            <p class="lh20 fs14 ">收货地址：{{detailInfo.receiverAddress}}</p>
            <!-- <el-button type="primary" v-if="detailInfo.refundStatus=='WAIT_RETUEN_GOODS' " size="small" @click="deliverGoodsDialogVisible = true" class="mgt8">去发货</el-button> -->
          </div>
        </div>
        <!--仅退款-->
        <div v-if="detailInfo.refundType =='MONEY_ONLY' && detailInfo.refundStatus == 'WAIT_AGREE'" class="mgt8">
          <el-button  @click="refusedDialogVisible = true">拒绝退款</el-button>
          <el-button type="primary"  @click="confirmRefund">同意退款</el-button>
        </div>

        <!--退货退款-->
        <!--同意退货申请-->
        <div v-if="detailInfo.refundType =='MONEY_GOODS' && detailInfo.refundStatus == 'WAIT_AGREE'" class="mgt8">
          <el-button  @click="refusedDialogVisible = true">拒绝申请</el-button>
          <el-button type="primary"  @click="agreeReturn">同意申请</el-button>
        </div>
        <!--收到退货，检查货品是否有问题，有问题拒绝退款，没问提确认收到货品并同意退款-->
        <div v-if="detailInfo.refundType =='MONEY_GOODS' && detailInfo.refundStatus == 'WAIT_RECIVE_GOODS'" class="mgt8">
          <el-button  @click="refusedDialogVisible = true">拒绝退款</el-button>
          <el-button type="primary"  @click="confirmReturn">收到并同意退货</el-button>
        </div>
        <!--同意退款-->
        <div v-if="detailInfo.refundType =='MONEY_GOODS' && detailInfo.refundStatus == 'WAIT_REFUND'" class="mgt8">
          <el-button type="primary"  @click="confirmRefund">同意退款</el-button>
        </div>
      </div>
    </div>
    <!--拒绝原因-->
    <el-dialog
      title="拒绝原因"
      :visible.sync="refusedDialogVisible"
      top="10%"
      width="30%">
      <el-input
        type="textarea"
        resize="none"
        :rows="6"
        placeholder="请输入拒绝原因"
        v-model="refuseReason">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refusedDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRefused">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { showRefundDetail, refuseRefund, confirmRefund, confirmReturn, agreeReturn } from '@/api/order.js'
  export default {
    name: 'afterSalesDetail',
    data() {
      return {
        detailInfo: {},
        step: 0,
        deliverGoodsDialogVisible: false,
        cols: [
          { label: '商品', prop: 'imageUrl' },
          { label: '品牌', prop: 'brandName' },
          { label: '规格', prop: 'goodsSpecName', width: '80' },
          { label: '运费', prop: 'freightName', width: '120' },
          { label: '销售价', prop: 'salePrice', width: '80' },
          { label: '备注', prop: 'orderSpecRemark' }
        ],
        refuseReason: '',
        refusedDialogVisible: false,
        goodsSpecsDetail: [],
        onlyMoneyStepData: [
          { title: '买家申请仅退款', time: '' },
          { title: '平台审核', time: '' },
          { title: '平台退款', time: '' }
        ],
        goodsMoneyStepData: [
          { title: '买家申请退款退货', time: '' },
          { title: '平台审核', time: '' },
          { title: '买家退货', time: '' },
          { title: '平台收到退货', time: '' },
          { title: '平台退款', time: '' }
        ]
        // onlyMoneyStatusList: ['WAIT_REFUND', 'REFUNDING', 'SUCCESS', 'FAIL', 'CANCEL', 'REFUSED']
      }
    },
    methods: {
      // 获取订单详情
      getOrderDetail() {
        const params = {
          refundOrderId: this.$route.query.id
        }
        showRefundDetail(params).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.detailInfo = res.data
            this.goodsSpecsDetail = []
            this.goodsSpecsDetail.push(this.detailInfo)
            // 仅退款
            if (this.detailInfo.refundType === 'MONEY_ONLY') {
              // 设置step的title
              switch (this.detailInfo.refundStatus) {
                case 'WAIT_REFUND':
                case 'REFUNDING':
                  this.onlyMoneyStepData[1].title = '平台同意退款'
                  break
                case 'REFUSED':
                  this.onlyMoneyStepData[1].title = '平台拒绝退款'
                  break
                case 'SUCCESS':
                  this.onlyMoneyStepData[1].title = '平台同意退款'
                  this.onlyMoneyStepData[2].title = '退款成功'
                  break
                case 'FAIL':
                  this.onlyMoneyStepData[1].title = '平台同意退款'
                  this.onlyMoneyStepData[2].title = '退款失败'
                  break
              }
              switch (this.detailInfo.refundStatus) {
                case 'WAIT_REFUND':
                case 'REFUNDING':
                case 'REFUSED':
                  this.step = 1
                  break
                case 'SUCCESS':
                case 'FAIL':
                  this.step = 2
              }
              // 设置step下的时间
              if (this.step >= 0) {
                this.onlyMoneyStepData[0].time = this.detailInfo.applyAt
              }
              if (this.step >= 1) {
                this.onlyMoneyStepData[1].time = this.detailInfo.reviewAt
              }
              if (this.step >= 2) {
                this.onlyMoneyStepData[2].time = this.detailInfo.refundAt
              }
            } else { // 退货退款
              switch (this.detailInfo.refundStatus) {
                case 'WAIT_RETUEN_GOODS':
                  this.goodsMoneyStepData[1].title = '平台同意申请'
                  break
                case 'REFUSED':
                  this.goodsMoneyStepData[1].title = '平台拒绝申请'
                  break
                case 'WAIT_RECIVE_GOODS':
                  this.goodsMoneyStepData[1].title = '平台同意申请'
                  this.goodsMoneyStepData[2].title = '买家退货'
                  break
                case 'WAIT_REFUND':
                case 'REFUNDING':
                  this.goodsMoneyStepData[1].title = '平台同意申请'
                  this.goodsMoneyStepData[2].title = '买家退货'
                  this.goodsMoneyStepData[3].title = '平台同意退货'
                  break
                case 'SUCCESS':
                  this.goodsMoneyStepData[1].title = '平台同意申请'
                  this.goodsMoneyStepData[2].title = '买家退货'
                  this.goodsMoneyStepData[3].title = '平台同意退货'
                  this.goodsMoneyStepData[4].title = '退款成功'
                  break
                case 'FAIL':
                  this.goodsMoneyStepData[1].title = '平台同意申请'
                  this.goodsMoneyStepData[2].title = '买家退货'
                  this.goodsMoneyStepData[3].title = '平台同意退货'
                  this.goodsMoneyStepData[4].title = '退款失败'
                  break
              }
              switch (this.detailInfo.refundStatus) {
                case 'WAIT_RETUEN_GOODS':
                case 'REFUSED':
                  this.step = 1
                  break
                case 'WAIT_RECIVE_GOODS':
                  this.step = 2
                  break
                case 'WAIT_REFUND':
                case 'REFUNDING':
                  this.step = 3
                  break
                case 'SUCCESS':
                case 'FAIL':
                  this.step = 4
                  break
              }
              // 设置step下的时间
              if (this.step >= 0) {
                this.goodsMoneyStepData[0].time = this.detailInfo.applyAt
              }
              if (this.step >= 1) {
                this.goodsMoneyStepData[1].time = this.detailInfo.agreeReturnAt
              }
              if (this.step >= 2) {
                this.goodsMoneyStepData[2].time = this.detailInfo.returnGoodsAt
              }
              if (this.step >= 3) {
                this.goodsMoneyStepData[4].time = this.detailInfo.reviewAt
              }
              if (this.step >= 4) {
                this.goodsMoneyStepData[4].time = this.detailInfo.refundAt
              }
            }
          }
        })
      },
      // 转换后台订单枚举为文本
      getRefundStatus(status) {
        let statusText = ''
        switch (status) {
          // case 'WAIT_AGREE': statusText = '待审核'; break;
          case 'WAIT_RETUEN_GOODS': statusText = '等待买家退货'; break;
          case 'WAIT_RECIVE_GOODS': statusText = '买家已退货'; break;
          case 'WAIT_REFUND': statusText = '平台收到退货'; break;
          case 'REFUNDING': statusText = '平台收到退货'; break;
          case 'SUCCESS': statusText = '平台收到退货'; break;
          case 'FAIL': statusText = '平台收到退货'; break;
        }
        return statusText
      },
      // 转换订单状态枚举值为文本
      changeOrderStatus(status) {
        let statusText = ''
        switch (status) {
          case 'WAIT_AGREE': statusText = '待审核'; break;
          case 'WAIT_RETUEN_GOODS': statusText = '等待买家退货'; break;
          case 'WAIT_RECIVE_GOODS': statusText = '待收到退货'; break;
          case 'WAIT_REFUND': statusText = '待退款'; break;
          case 'REFUNDING': statusText = '退款中'; break;
          case 'SUCCESS': statusText = '退款成功'; break;
          case 'FAIL': statusText = '退款失败'; break;
          case 'CANCEL': statusText = '买家取消退款'; break;
          case 'REFUSED': statusText = '拒绝退款'; break;
        }
        return statusText
      },
      // 判断售后单是否处于同意退货的状态
      isAgreeRefund(status) {
        const agreeStatus = ['WAIT_RETUEN_GOODS', 'WAIT_RECIVE_GOODS', 'WAIT_REFUND', 'REFUNDING', 'SUCCESS', 'FAIL']
        return agreeStatus.indexOf(status) !== -1? true:false
      },
      // 同意退货
      agreeReturn() {
        this.$confirm('确定同意退货退款吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          const params = {
            refundOrderId: this.detailInfo.refundOrderId
          }
          agreeReturn(params).then(res => {
            console.log(res)
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '已同意退货!'
              })
            }
            this.getOrderDetail()
          })
        }).catch(() => {
          console.log('取消同意退货')
        })
      },
      // 确定收到退货
      confirmReturn() {
        this.$confirm('确定收到并同意退货吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          const params = {
            refundOrderId: this.detailInfo.refundOrderId
          }
          confirmReturn(params).then(res => {
            console.log(res)
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '确定收到退货!'
              })
            }
            this.getOrderDetail()
          })
        }).catch(() => {
          console.log('取消收到退货')
        })
      },
      // 拒绝退款
      confirmRefused() {
        if (this.refuseReason.trim() === '') {
          this.$message.error({
            message: '请输入拒绝原因'
          })
          return
        }
        const params = {
          refundOrderId: this.detailInfo.refundOrderId,
          refuseReason: this.refuseReason
        }
        refuseRefund(params).then(res => {
          if (res.code === 0) {
            this.getOrderDetail()
            this.refusedDialogVisible = false
          }
          console.log(res)
        })
      },
      // 确定退款
      confirmRefund() {
        let tip = this.detailInfo.refundType === 'MONEY_ONLY' ? '确定同意退款吗？' : '确定收到退货并同意退款吗?'
        if (this.detailInfo.refundStatus === 'FAIL') {
          tip = '确定重新发起退款吗？'
        }

        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            finPaymentId: this.detailInfo.paymentId,
            payMethod: this.detailInfo.payMethod
          }
          confirmRefund(params).then(res => {
            console.log(res)
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '确认成功，平台退款中...'
              })
            }
            this.getOrderDetail()
          })
        }).catch(() => {
          console.log('取消确认退款')
        })
      }
    },
    created() {
      this.getOrderDetail()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import 'src/styles/variables.scss';
  // 重写步骤条样式
  .after-sales-detail{
    /*重写表单*/
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .after-sales-detail{
    .setp{
      background-color: #fff;
      .setp-header{
        font-size: 18px;
        padding:18px 0 18px 32px;
        border-bottom:1px solid $divideBorder;
      }
      .setp-content{
        padding:24px;
        .setp-icon{
          width:32px;
          height:32px;
          line-height: 32px;
          color: $sysGolden;
          display:inline-block;
          background:linear-gradient(90deg,rgba(68,69,64,1),rgba(27,27,27,1));
          box-shadow: 0px 4px 6px 0px rgba(163,163,165,1);
          border-radius:50%;
          .el-icon-check{
            font-size: 18px;
            line-height: 32px;
          }
          &.error{
            color: #fff;
            background:linear-gradient(90deg,rgba(255,121,133,1),rgba(253,62,85,1));
            box-shadow:0px 4px 6px 0px rgba(252,184,191,1);
          }
        }

        /*<!--.icon-txt{-->*/
        /*<!--color:$sysGolden;-->*/
        /*<!--height:32px;-->*/
        /*<!--line-height:32px;-->*/
        /*<!--top:0;-->*/
        /*<!--right:12px;-->*/
        /*<!--}-->*/
        .setp-radius{
          width:14px !important;
          height:14px !important;
          border-radius:50%;
          background:$inputBorder;
          display:inline-block;
        }
        .is-finish{
          .setp-radius{
            background-color: $mainText;
          }
        }
        .size{
          font-size:20px;
          right:5px;
        }
      }

      .pay-status{
        color: $sysBlack;
        padding:16px 0;
        .pay-titile{
          font-size: 16px;
          font-weight:600;
        }
      }
      .bg-color{
        background-color:#FAFAFA;
        /*padding:16px 0 16px 16px;*/
      }
    }

    .order-detail-btn{
      padding: 0;
      width: auto;
    }
    .refused-content{
      width: 700px;
      font-size: 14px;
      background-color: #FFF6F7;
      color: $sysRed;
      padding: 10px;
    }
  }
</style>
