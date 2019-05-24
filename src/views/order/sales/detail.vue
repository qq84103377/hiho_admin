<template>
  <div class="sales-order-detail">
    <content-wrap title="订单详情">
      <el-button slot="btn" @click="$router.go(-1)">返回</el-button>
    </content-wrap>
    <div class="setp mgb16">
      <div class="setp-header fs18">订单状态</div>
      <el-steps :active="step" align-center class="setp-content" finish-status="finish">
        <el-step title="已下单">
          <div slot="icon">
            <span v-if="step == 0" class="setp-icon">{{step+1}}</span>
            <span v-else class="setp-radius"></span>
          </div>
          <div v-if="step>=0" slot="description"><span class="auxiliaryText">{{detailInfo.orderAt}}</span></div>
        </el-step>
        <el-step>
          <div slot="icon">
            <span v-if="step == 1" class="setp-icon">{{step+1}}</span>
            <span v-else class="setp-radius"></span>
          </div>
          <div slot="title">{{step <1?"待付款":'已付款'}}</div>
          <div v-if="step>=1" slot="description"><p>{{detailInfo.payAt}}</p><p>{{detailInfo.payNum}}</p></div>
        </el-step>
        <el-step>
          <div slot="icon">
            <span v-if="step == 2" class="setp-icon"><span class="el-icon-check"></span></span>
            <span v-else class="setp-radius"></span>
          </div>
          <div slot="title">{{step < 2 ? "待发货":'已发货'}}</div>
          <div v-if="step===1" slot="description"><el-button v-if="step === 1" size="small" @click="deliverGoodsDialogVisible = true">去发货</el-button></div>
          <div v-else-if="step>=2"  slot="description">
            <p class="auxiliaryText">{{detailInfo.deliveryAt}}</p>
            <p class="auxiliaryText">{{detailInfo.logisticsCompany}}:{{detailInfo.logisticsNum}}</p>
          </div>
        </el-step>
      </el-steps>
    </div>
    <div class="setp">
      <div class="setp-header">订单信息</div>
      <div class="pdlr32">
        <div class="pay-status borderB">
          <span class="pay-titile">下单信息</span>
          <el-form label-position="left" label-width="70px" class="form-readonly mgt16">
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单编号：">
                <span>{{detailInfo.orderNum}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单时间：">
                <span>{{detailInfo.orderAt}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单总价：">
                <span class="sysRed">￥{{detailInfo.totalAmount}}</span>&nbsp;<span>({{detailInfo.goodsSum}}件/￥{{detailInfo.orderAmount}},运费￥{{detailInfo.freight}})</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费规则：">
                <span>{{detailInfo.freightTemplete}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="下单用户：">
                <span class="sysBlue">￥{{detailInfo.ordererName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系方式：">
                <span>{{detailInfo.ordererPhone}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        </div>

        <div class="borderB pay-status">
          <span class="pay-titile mgr16">支付状态</span>
          <span>{{getPayStatus(detailInfo.payStatus)}}</span>
          <el-form v-if="detailInfo.payStatus=='FINISHED_PAY' " label-position="left" label-width="70px" class="form-readonly mgt16">
            <el-row>
              <el-col :span="8">
                <el-form-item label="支付金额：">
                  <span>{{detailInfo.payAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="支付流水：">
                  <span>{{detailInfo.payNum}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="支付方式：">
                  <span>{{detailInfo.payMethod === 'WX_PAY'?'微信支付':'支付宝'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div class="pay-status borderB">
          <span class="fs16 pay-titile mgr16">发货状态</span>
          <span :class="{'sysRed':detailInfo.orderStatus=='WAIT_PAY' || detailInfo.orderStatus=='WAIT_SEND' }">{{getOrderStatus(detailInfo.orderStatus)}}</span>
          <div class="pay-logistics">
            <p v-if="detailInfo.orderStatus==='SENDED'" class="fs14 mgt16">{{detailInfo.logisticsCompany}}：{{detailInfo.logisticsNum}}</p>
            <el-button type="primary" v-if="detailInfo.orderStatus=='SENDED'" @click="open">编辑物流信息</el-button>
          </div>
          <div style="width: 700px" class="bg-color mgt16">
            <p class=" fs14 lh20 mgb8">
              <span class="pdr60">收货人：{{detailInfo.receiverName}}</span>
              <span>联系方式：{{detailInfo.receiverPhone}}</span>
            </p>
            <p class="lh20 fs14 ">收货地址：{{detailInfo.receiverAddress}}</p>
            <el-button type="primary" v-if="detailInfo.orderStatus=='WAIT_SEND'" size="small" @click="deliverGoodsDialogVisible = true" class="mgt8">去发货</el-button>
          </div>
        </div>

        <div class="pay-status borderB">
          <p class="pay-titile mgb16">要货明细</p>
          <el-row>
            <el-table
               border
              :data="detailInfo.goodsSpecsDetail"
              style="width: 100%">
              <template v-for="e in cols">
                <el-table-column
                  v-if="e.prop == 'goodsPicture'"
                  :prop="e.prop"
                  :width="e.width"
                  :label="e.label">
                  <template slot-scope="scope">
                    <div style="display: flex; align-items: center;">
                      <img style="width: 40px;height: 40px;margin-right: 12px;" :src="scope.row.goodsPicture" alt="商品图片">
                      <div>
                        <span>{{ scope.row.goodsStyleNo}}</span>
                       <span>{{ scope.row.goodsName }}</span>
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
                      <p class="sysDarkGreen">买家申请{{scope.row.refundType === 'MONEY_ONLY'? '仅退款':'退款退货'}}</p>
                      <p style="color: #9898A1">售后单号：<span style="color: #3C8EEF;cursor: pointer;" @click="$router.push(`/afterSalesDetail?id=${scope.row.refundOrderId}`)">{{scope.row.refundOrderNum}}</span></p>
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
            <span class="sum fs14">总计：￥{{detailInfo.orderAmount}}/{{detailInfo.goodsSum}}件</span>
          </el-row>
        </div>
      </div>
    </div>
    <deliver-goods-dialog @deliverSuccess="getOrderDetail" :orderId="detailInfo.id" :visible.sync="deliverGoodsDialogVisible" :formDate="form"></deliver-goods-dialog>

  </div>
</template>

<script>
import { getOrderDetail } from '@/api/order.js'
import deliverGoodsDialog from './components/deliverGoodsDialog'
export default {
  name: 'salesOrderDetail',
  data() {
    return {
      detailInfo: {},
      step: 0,
      deliverGoodsDialogVisible: false,
      cols: [
        { label: '商品', prop: 'goodsPicture' },
        { label: '品牌', prop: 'brandName' },
        { label: '规格', prop: 'specName', width: '80' },
        { label: '运费', prop: 'freightName', width: '120' },
        { label: '销售价', prop: 'price', width: '80' },
        { label: '备注', prop: 'remark' },
        { label: '售后', prop: 'refundType' }
      ],
      form: {}
    }
  },
  methods: {
    open () {
      this.form = {
        logisticsCompany: this.detailInfo.logisticsCompany,
        logisticsNum: this.detailInfo.logisticsNum
      }
      this.deliverGoodsDialogVisible = true
    },
    // 获取订单详情
    getOrderDetail() {
      const params = {
        id: this.$route.query.id
      }
      getOrderDetail(params).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.detailInfo = res.data
          if (this.detailInfo.orderStatus === 'WAIT_SEND') {
            this.step = 1
          } else if (this.detailInfo.orderStatus === 'SENDED'){
            this.step = 2
          }
        }
      })
    },
    // 转换后台支付状态枚举为文本
    getPayStatus(status) {
      let statusText = ''
      switch (status) {
        case 'WAIT_PAY' : statusText = '待支付 ';break;
        case 'FINISHED_PAY' : statusText = '支付成功 '; break;
        case 'FAILURE_PAY' : statusText = '支付失败 '; break;
        case 'CANCLE_PAY' : statusText = '取消支付 '; break;
      }
      return statusText
    },
    // 转换后台订单枚举为文本
    getOrderStatus(status) {
      let statusText = ''
      switch (status) {
        case 'WAIT_PAY' : statusText = '待付款 ';break;
        case 'WAIT_SEND' : statusText = '待发货 '; break;
        case 'SENDED' : statusText = '已发货 '; break;
        case 'CANCEL' : statusText = '订单取消 '; break;
      }
      return statusText
    }
  },
  components: {
    deliverGoodsDialog
  },
  created(){
    this.getOrderDetail()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
 @import 'src/styles/variables.scss';
// 重写步骤条样式
.sales-order-detail{
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
 @import 'src/styles/variables.scss';
.sales-order-detail{
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
      .btn{
        background-color:$mainText;
        color:$sysGolden;
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
    .pay-logistics{
      display: flex;
      p{
        flex: 3;
      }
    }
    .bg-color{
      background-color:#FAFAFA;
      padding:16px 0 16px 16px;
    }

    .sum{
      margin-top:8px;
      height:20px;
      display:block;
      line-height:20px;
      color:$mainText;
    }
  }
}
</style>
