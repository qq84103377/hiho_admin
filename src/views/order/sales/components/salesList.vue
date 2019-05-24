<template>
  <div class="sales-order-index">
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top: 16px;">
        <el-table-column
          prop="orderNum"
          label="订单号">
        </el-table-column>
        <el-table-column
          prop="orderAt"
          label="下单时间"
          sortable
          width="105">
          <template slot-scope="scope">
            <p class="sysBlack fs14">{{scope.row.orderAt?scope.row.orderAt.slice(0,scope.row.orderAt.indexOf(' ')):''}}</p>
            <p class="auxiliaryText fs12">{{scope.row.orderAt?scope.row.orderAt.slice(scope.row.orderAt.indexOf(' ')):''}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="下单用户"
          width="120">
          <template slot-scope="scope">
            <p class="sysBlack fs14">{{scope.row.userName}}</p>
            <p class="auxiliaryText  fs12">{{scope.row.userPhone}}</p>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$route.path=='/order/index/salesList'"
          prop="brand"
          label="品牌">
        </el-table-column>
        <el-table-column
          prop="goodsSpecsDetail"
          label="要货件数"
          width="100">
          <template slot-scope="scope">
            <p class="sysBlack fs14">{{scope.row.goodsSum}}件</p>
            <!--<span class="auxiliaryText detail-btn fs12">明细</span>-->
            <el-popover
              placement="bottom"
              width="900"
              trigger="click"
              @show="showPopover(scope.$index)"
              @hide="hidePopover(scope.$index)">
              <el-table max-height="250" border :data="scope.row.goodsSpecsDetail">
                <el-table-column width="200" property="goodsName" label="商品">
                  <template slot-scope="scope">
                    <img
                      style="width:40px;height:40px;vertical-align:middle;margin-right: 12px;border: 1px solid #EBEBF2"
                      :src="scope.row.goodsPicture"/>
                    <div style="display: inline-block;vertical-align:middle;">
                      <p class="sysBlack fs14">{{scope.row.goodsStyleNo}}</p>
                      <p class="auxiliaryText fs12">{{scope.row.goodsName}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="70" property="specName" label="规格"></el-table-column>
                <el-table-column width="120" property="freightName" label="运费"></el-table-column>
                <el-table-column width="100" property="price" label="销售价"></el-table-column>
                <el-table-column width="220" property="remark" label="备注"></el-table-column>
                <el-table-column width="180" property="address" label="售后">
                  <template slot-scope="scope">
                    <div v-if="scope.row.refundType">
                      <p class="sysDarkGreen fs14">{{scope.row.refundType == 'MONEY_ONLY'?'仅退款':'退款退货'}}</p>
                      <p class="auxiliaryText fs12">售后单:{{scope.row.refundOrderNum}}</p>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-button class="detail-btn" :class="{'active':scope.row.isShowPopover}" size="mini" slot="reference">
                明细
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="合计"
          width="150">
          <template slot-scope="scope">
            <p class="sysRed fs14">¥{{((scope.row.orderAmount*1)+(scope.row.freight*1)).toFixed(2)}}</p>
            <p class="auxiliaryText  fs12">{{scope.row.goodsSum}}件&nbsp;¥{{scope.row.orderAmount}},&nbsp;&nbsp;运费¥{{scope.row.freight}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="payMethod"
          label="支付方式"
          width="160">
          <template slot-scope="scope">
            <p class="sysBlack fs14">{{scope.row.payMethod == 'WX_PAY'?'微信支付':'支付宝'}}</p>
            <p class="auxiliaryText fs12">流水:{{scope.row.payNum}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          width="170">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 'SENDED'">
              <p class="sysBlack fs14">已发货</p>
              <p class="auxiliaryText fs12">{{scope.row.logisticsCompany}}&nbsp;&nbsp;{{scope.row.logisticsNum}}</p>
            </div>
            <p v-else-if="scope.row.status === 'WAIT_PAY'" class="sysBlack fs14">待付款</p>
            <p v-else-if="scope.row.status === 'CANCEL'" class="auxiliaryText fs14">订单取消 </p>
            <p v-else-if="scope.row.status === 'EXPIRE'" class="sysBlack fs14">超时自动关闭 </p>
            <div v-else-if="scope.row.status === 'WAIT_SEND'">
              <span class="sysRed fs14">待发货</span>
              <el-button style="width: 60px;" @click="deliverGoods(scope.row.id)" size="mini fs14 mgl5">发货</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button style="width: 56px;" v-if="scope.row.status !== 'CANCEL'" type="text" size="small"
                       @click="$router.push({path:'/salesDetail',query:{id:scope.row.id}})"><i
              class="iconfont icon-check mgr5 sysBlue"></i><span class="look fs14">查看</span></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-col class="page-content">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="prev, pager, next" :total="totalCount">
        </el-pagination>
      </el-col>

      <deliver-goods-dialog @deliverSuccess="$emit('success')" :orderId="deliverOrderId"
                            :visible.sync="deliverGoodsDialogVisible"></deliver-goods-dialog>
    </div>
  </div>
</template>

<script>
  import deliverGoodsDialog from './deliverGoodsDialog'
  export default {
    name: 'salesOrderIndex1',
    props: {
      tableData: {
        type: Array,
        default: []
      },
      totalCount: {
        type: Number,
        default: 0
      },
      pageSize: {
        type: Number,
        default: 0
      }
    },
    components: {deliverGoodsDialog},
    data() {
      return {
        deliverGoodsDialogVisible: false,
        deliverOrderId: ''
      }
    },
    methods: {
      // 分页
      handleCurrentChange(e) {
        this.$emit('handleCurrentChange', e)
      },
      // 显示订单商品明细
      showPopover(index) {
        this.$set(this.tableData[index], 'isShowPopover', true)
      },
      // 隐藏订单商品明细
      hidePopover(index) {
        this.$set(this.tableData[index], 'isShowPopover', false)
      },
      // 显示发货弹窗
      deliverGoods(id) {
        this.deliverOrderId = id
        this.deliverGoodsDialogVisible = true
      }
    }
  }
</script>

<style lang="scss" scope>
  @import 'src/styles/variables.scss';
  /*.el-button{*/
    /*width: auto;*/
  /*}*/
  .detail-btn {
    width: 50px;
    border: 1px solid $divideBorder;
    background: $divideBorder;
    padding: 4px 13px;
    &.active {
      color: $sysBlack;
      background: $sysGolden;
      border: 1px solid $sysGolden;
    }
  }
</style>

