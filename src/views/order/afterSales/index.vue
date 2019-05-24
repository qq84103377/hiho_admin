<template>
  <div class="after-sales-list">
    <div>
      <!-- 查询条件 -->
      <filterPanel :multiple="true" @selectSearch="brandSearch" @submitSearch="keywordSearch" :checkboxInfo="brandList" :filterText="filterText">
        <div slot="footer">
          <el-row>
            <el-col :span="21">
              <el-col :span="7">
                <div class="select-group fs14">
                  <span class="mgr10">选择商品:</span>
                  <el-select @change="getOrderList" filterable v-model="filter.goodsIdList" multiple clearable placeholder="不限">
                    <el-option
                      v-for="item in goodList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="select-group fs14">
                  <span class="mgr10">下单用户:</span>
                  <el-select @change="getOrderList" filterable  v-model="filter.userIdList" multiple clearable placeholder="不限">
                    <el-option
                      v-for="item in userList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="select-group fs14">
                  <span class="mgr10">服务类型:</span>
                  <el-select @change="getOrderList" v-model="filter.refundType" clearable placeholder="不限">
                    <el-option
                      v-for="item in refundTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-col>
            <el-col :span="3">
              <div class="select-btn" @click="searchShow = !searchShow">更多筛选条件<i :class="['select-iocn', searchShow ? 'el-icon-arrow-up ' : 'el-icon-arrow-down']"></i>
              </div>
            </el-col>
          </el-row>
          <transition name="fade">
            <div class="search" v-show="searchShow">
              <div style="float: left; margin-right: 18px;">
                <span style="color: #29292A;font-size: 14px;margin-right: 10px;">下单时间:</span>
                <el-date-picker
                  v-model="orderTime"
                  @change="selectTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </div>
          </transition>
        </div>
      </filterPanel>
      <el-radio-group v-model="filter.refundStatus" style="margin:18px 0 10px 0;" @change="changePayStatus">
        <el-radio-button v-for="item in orderStatusList" :label="item.value">{{ item.label }}</el-radio-button>
      </el-radio-group>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="orderList"
        border
        style="width: 100%">
        <el-table-column
          prop="goodsImage"
          label="退款商品">
            <template slot-scope="scope">
              <div style="display: flex; align-items: center;">
                <img style="width: 40px;height: 40px;margin-right: 12px;border: 1px solid #ebebf2;" :src="scope.row.goodsImage" alt="">
                <div>
                  <p>{{scope.row.goodsStyleNo}}</p>
                  <div class="lh18">
                    <span class="spec-block">{{ scope.row.goodsSpecName }}</span>
                    <span class="sysRed">¥{{ scope.row.salePrice }}</span>
                  </div>
                </div>
              </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="brandName"
          width="110"
          label="品牌">
        </el-table-column>
        <el-table-column
          prop="refundOrderNum"
          label="售后单号"
          width="140">
          <template slot-scope="scope">
            <p class="sysBlack fs14">{{scope.row.refundOrderNum}}</p>
            <p class="auxiliaryText  fs12">{{scope.row.applyAt}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundType"
          label="服务类型"
          width="80">
          <template slot-scope="scope">
            <p class="sysBlack fs14">{{scope.row.refundType == 'MONEY_ONLY'?'仅退款':'退款退货'}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户"
          width="120">
          <template slot-scope="scope">
            <p class="sysBlack fs14">{{scope.row.userName}}</p>
            <p class="auxiliaryText  fs12">{{scope.row.phone}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundAmount"
          label="退款金额"
          width="80">
          <template slot-scope="scope">
            <p class="sysDarkGreen">¥{{scope.row.refundAmount}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundStatus"
          label="订单状态"
          width="140">
          <template slot-scope="scope">
            <p :class="{'sysRed':scope.row.refundStatus=='FAIL' || scope.row.refundStatus=='WAIT_AGREE' || scope.row.refundStatus=='WAIT_RECIVE_GOODS',
                        'auxiliaryText':scope.row.refundStatus=='CANCEL' || scope.row.refundStatus=='REFUSED',
                        'sysDarkGreen':scope.row.refundStatus=='SUCCESS'}">{{ changeOrderStatus(scope.row.refundStatus)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button v-if="scope.row.refundStatus!='CANCEL'" type="text" size="small" @click="$router.push({path:'/afterSalesDetail',query:{id:scope.row.refundOrderId}})"><i class="iconfont icon-check mgr5 sysBlue"></i><span class="look fs14">查看</span></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-col class="page-content">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="filter.pageSize"
          layout="prev, pager, next" :total="totalCount">
        </el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script>
  import { listRefundOrder } from '@/api/order.js'
  import { listBrand } from '@/api/brand.js'
  import { listGoods } from '@/api/goods.js'
  import { getUserList } from '@/api/user.js'
  export default {
    name: 'afterSalesList',
    data() {
      return {
        filter: {
          refundOrderNum: '',
          brandIdList: [],
          goodsIdList: [],
          userIdList: [],
          refundType: '',
          applyAtStartFilter: '',
          applyAtEndFilter: '',
          refundStatus: '',
          pageNum: 1,
          pageSize: 10
          // sortBy: 'orderAt',
          // sortType: '1'
        },
        filterText: {
          value1: '单号搜索',
          value2: '请输入售后单号搜索',
          value3: '商品品牌'
        },
        searchShow: false,
        totalCount: 0,
        orderList: [],
        brandList: [],
        goodList: [],
        userList: [],
        refundTypeList: [
          { value: '', label: '全部' },
          { value: 'MONEY_ONLY', label: '仅退款' },
          { value: 'MONEY_GOODS', label: '退款退货' }
        ],
        orderTime: '',
        orderStatusList: [
          { value: '', label: '全部' },
          { value: 'WAIT_AGREE', label: '待审核' },
          { value: 'WAIT_RETUEN_GOODS', label: '待退货' },
          { value: 'WAIT_RECIVE_GOODS', label: '待收退货' },
          { value: 'WAIT_REFUND', label: '待退款' },
          { value: 'REFUNDING', label: '退款中' },
          { value: 'SUCCESS', label: '退款成功' },
          { value: 'FAIL', label: '退款失败' },
          { value: 'CLOSED', label: '已关闭' }
        ],
        loading: false
      }
    },
    methods: {
      // 通过支付状态筛选
      changePayStatus(val) {
        this.filter.refundStatus = val
        this.getOrderList()
      },
      // 获取订单列表
      getOrderList() {
        this.loading = true
        listRefundOrder(this.filter).then(res => {
          if (res.code === 0) {
            this.loading = false
            this.orderList = res.data.refundOrderList
            this.totalCount = res.data.totalCount
          }
        })
      },
      // 分页
      handleCurrentChange(e) {
        this.filter.pageNum = e
        this.getOrderList()
      },
      // 获取品牌列表
      getBrandList() {
        let params = {
          keyword: '',
          pageNum: 0,
          pageSize: 0
        }
        listBrand(params).then(res => {
          console.log(res, '品牌列表')
          this.brandList = res.data.brandOneResponseList
          console.log(this.brandList)
        })
      },
      // 通过品牌筛选
      brandSearch(v) {
        if (!v) {
          v = []
        }
        this.filter.brandIdList = v
        this.getOrderList()
      },
      // 通过关键词搜索
      keywordSearch(v) {
        this.filter.refundOrderNum = v
        this.getOrderList()
      },
      // 获取商品列表
      getGoodsList() {
        const params = {
          keyword: '',
          brandFilter: '',
          stockFilter: '',
          statusFilter: '',
          pageNum: 0,
          pageSize: 0,
          startCreateTimeFilter: '',
          endCreateTimeFilter: '',
          sortBy: 'createAt',
          sortType: 1
        }
        listGoods(params).then(res => {
          console.log(res, '商品列表')
          this.goodList = res.data.goods
        })
      },
      // 获取用户列表
      getUserList() {
        const params = {
          keyword: '',
          levelFilter: '',
          hasWxFilter: '',
          orderFilter: '',
          createAtStartFilter: '',
          createAtEndFilter: '',
          pageNum: 0,
          pageSize: 0
        }
        getUserList(params).then(res => {
          console.log(res, '用户列表')
          this.userList = res.data.users
        })
      },
      // 选择时间触发
      selectTime(v) {
        this.filter.applyAtStartFilter = v ? Number(new Date(v[0])) / 1000 : ''
        this.filter.applyAtEndFilter = v ? (Number(new Date(v[1])) + 86399000) / 1000 : ''
        console.log(this.filter,'选择时间后')
        this.getOrderList()
      },
      // 转换订单状态枚举值为文本
      changeOrderStatus(status) {
        let statusText=''
        switch (status){
          case 'WAIT_AGREE': statusText = '待审核'; break;
          case 'WAIT_RETUEN_GOODS': statusText = '等待买家退货'; break;
          case 'WAIT_RECIVE_GOODS': statusText = '待收到退货'; break;
          case 'WAIT_REFUND': statusText = '待退款'; break;
          case 'REFUNDING': statusText = '退款中'; break;
          case 'SUCCESS': statusText = '退款成功'; break;
          case 'FAIL': statusText = '退款失败'; break;
          case 'CANCEL': statusText = '已关闭(买家取消)'; break;
          case 'REFUSED': statusText = '已关闭(平台拒绝)'; break;
        }
        return statusText
      }
    },
    created() {
      this.getOrderList()
      this.getBrandList()
      this.getGoodsList()
      this.getUserList()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import 'src/styles/variables.scss';
  .after-sales-list{
    //  重写标签页样式
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
      background-color: #fff;
      color:$mainText;
      background-color: #fff;
      border-color: $inputBorder;
      box-shadow: -1px 0 0 0 $inputBorder;
    }
    .el-radio-button__inner{
      background-color:$lightBg;
      color:$auxiliaryText;
      &:hover{
        color:$auxiliaryText;
        background-color: #fff;
      }
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .after-sales-list{
    .detail-btn{
      border:1px solid $divideBorder;
      background:$divideBorder;
      padding:4px 13px;
      &.active{
        color: $sysBlack;
        background: $sysGolden;
        border:1px solid $sysGolden;
      }
    }
    .content{
      margin-top:16px;
      height:96px;
      border:1px solid #E8E8E8;
      background:rgba(255,255,255,1);
      line-height:96px;
      text-align:center;
      .text{
        margin:0 !important;
        font-size:14px;
        font-family:PingFangSC-Regular;
        color:rgba(184,184,197,1);
      }
    }
    .select-btn{
      height:36px;
      line-height: 36px;
      font-size:14px;
      color:#29292A;
      cursor:pointer;
      text-align:right;
      .select-iocn {
        margin-left:5px;
      }
    }
    .el-button{width:56px;}
    .look{
      color:$sysBlue;
      &:hover{
        text-decoration:underline;
      }
    }

    .spec-block{
      display: inline-block;
      width: 40px;
      text-align: center;
      margin-right: 10px;
      font-size: 12px;
      color: $functionText;
      background-color: #f1f1f1;
    }
  }
</style>
