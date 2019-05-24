<template>
  <div class="pay-record-index">
    <div class="content-wrap header">
      <div class="menu-item sysBlack">支付流水</div>
    </div>
    <!-- <div class="no-message" v-if="tableData.length==0">暂无支付流水信息</div> -->
    <div>
      <!-- 查询条件 -->
      <div class="search-form">
        <el-form :model="searchForm" label-width="90px" :inline="true" class="demo-form-inline">
          <el-row class="border">
            <el-form-item label="流水查询">
              <el-input
                placeholder="输入流水号/用户名/单据号搜索"
                prefix-icon="el-icon-search"
                v-model="searchForm.keyword" @input="getData">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row class="mgt16">
            <el-form-item label="交易状态">
              <el-select v-model="searchForm.status" placeholder="不限" clearable @change="getData">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易类型">
              <el-select v-model="searchForm.type" placeholder="不限" clearable @change="getData">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生成时间">
              <el-date-picker
                @change="getData"
                v-model="createdTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        :default-sort = "{prop: 'date', order: 'descending'}"
        style="width: 100%">
        <template v-for="e in clos">
          <el-table-column
            :prop="e.prop"
            :label="e.label"
            :key="e.label"
            :sortable="e.sortable"
            :width="e.width || ''" v-if="e.prop === 'payAt'">
            <template slot-scope="scope">
              <div>{{scope.row.payAt&&scope.row.payAt.split(' ')[0]}}</div>
              <div>{{scope.row.payAt&&scope.row.payAt.split(' ')[1]}}</div>
            </template>
          </el-table-column>
          <el-table-column
            :prop="e.prop"
            :label="e.label"
            :key="e.label"
            :sortable="e.sortable"
            :width="e.width || ''" v-else-if="e.prop === 'referNum'">
            <template slot-scope="scope">
              <span  v-if="scope.row.type === '0'" type="text" size="small" @click="$router.push({path:'/salesDetail',query:{id:scope.row.orderId}})" class="sysBlue fs14 btn">{{scope.row.referNum}}</span>
              <span  v-else-if="scope.row.type === '1'" type="text" size="small" class="sysBlue fs14 btn" @click="$router.push({path:'/afterSalesDetail',query:{id:scope.row.refundOrderId}})">{{scope.row.referNum}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :prop="e.prop"
            :label="e.label"
            :key="e.label"
            :sortable="e.sortable"
            :width="e.width || ''" v-else-if="e.prop === 'payMethod'">
            <template slot-scope="scope">
              <div class="sysBlack fs14">{{payMethodMap[scope.row.payMethod]}}</div>
              <div class="auxiliaryText fs12">{{scope.row.transactionNo}}</div>
            </template>
          </el-table-column>
          <el-table-column
            :prop="e.prop"
            :label="e.label"
            :key="e.label"
            :sortable="e.sortable"
            :width="e.width || ''" v-else-if="e.prop === 'status'">
            <template slot-scope="scope">
              <span :class="[scope.row.status == 'FAILURE_PAY'?'colorGray' : 'sysBlack']">{{statusMap[scope.row[e.prop]]}}</span>
              <!-- <div v-if="scope.row.status !== 'FINISHED_PAY'">
                <span class="colorGray">{{statusMap[scope.row[e.prop]]}}</span>
              </div>
              <span v-else :class="[scope.row[e.prop] > 0 ? 'colorRed' : 'colorGreen']">{{statusMap[scope.row[e.prop]]}}</span> -->
            </template>
          </el-table-column>
          <el-table-column
            :prop="e.prop"
            :label="e.label"
            :key="e.label"
            :sortable="e.sortable"
            :width="e.width || ''" v-else-if="e.prop === 'type'">
            <template slot-scope="scope">
              <div  v-if="scope.row.status == 'FAILURE_PAY'" class="colorGray">{{typeMap[scope.row[e.prop]]}}</div>
              <span v-else :class="[scope.row[e.prop] === '0'? 'colorRed' : 'colorGreen']">{{typeMap[scope.row[e.prop]]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :prop="e.prop"
            :label="e.label"
            :key="e.label"
            :sortable="e.sortable"
            :width="e.width || ''" v-else-if="e.prop === 'payAmount'">
            <template slot-scope="scope">
              <div  v-if="scope.row.status == 'FAILURE_PAY'" class="colorGray">{{typeMap[scope.row[e.prop]]}}</div>
              <span v-else :class="[scope.row.type == '0' ? 'colorRed' : 'colorGreen']">{{`${scope.row.type == '0'? '+ ￥': '- ￥'}${scope.row[e.prop]}`}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :prop="e.prop"
            :label="e.label"
            :key="e.label"
            :sortable="e.sortable"
            :width="e.width || ''" v-else>
          </el-table-column>
        </template>
      </el-table>
      <!-- 分页 -->
      <el-col class="page-content">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="prev, pager, next" :total="totalCount">
        </el-pagination>
      </el-col>
    </div>
  </div>
</template>
<script>
import {listFinPayment} from '@/api/pay.js'
export default {
  name: 'payRecordIndex',
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      totalCount: 0,
      searchForm: {
        keyword: '',
        status: '',
        type: '',
        createAtStartFilter: '',
        createAtEndFilter: ''
      },
      createdTime: '',
      loading: false,
      statusList: [
        {alue: '', label: '全部'},
        // {value: 'WAIT_PAY', label: '待支付'},
        {value: 'FINISHED_PAY', label: '支付成功'},
        {value: 'FAILURE_PAY', label: '支付失败'}
        // {value: 'CANCLE_PAY', label: '取消支付'}
      ],
      statusMap: {'FINISHED_PAY': '支付成功', 'FAILURE_PAY': '支付失败'},
      payMethodMap: {'WX_PAY': '微信支付', 'CASH_PAY': '现金支付', 'ALI_PAY': '支付宝支付', 'PAYECO_PAY': '银行卡/信用卡支付'},      
      typeMap: {'0': '收款', '1': '退款'},
      typeList: [
        {alue: '', label: '全部'},
        {value: '0', label: '收款'},
        {value: '1', label: '退款'}
      ],
      tableData: [],
      clos: [
        {label: '流水号', prop: 'payNum', sortable: false},
        {label: '时间', prop: 'payAt', sortable: true, width: 120},
        {label: '用户', prop: 'userName', sortable: false, width: 120},
        {label: '相关订单/售后单', prop: 'referNum', sortable: false},
        {label: '收款平台', prop: 'payMethod', sortable: false},
        {label: '状态', prop: 'status', sortable: false, width: 120},
        {label: '类型', prop: 'type', sortable: false, width: 120},
        {label: '金额', prop: 'payAmount', sortable: false, width: 120}
      ]
    }
  },
  methods: {
    // 分页
    handleCurrentChange (e) {
      this.pageNum = e
      this.getData()
    },
    getData () {
      this.loading = true
      this.searchForm.createAtStartFilter = this.createdTime ? Number(new Date(this.createdTime[0])) / 1000 : ''
      this.searchForm.createAtEndFilter = this.createdTime ? (Number(new Date(this.createdTime[1]))  + 86399000) / 1000 : ''
      let params = {
        ...this.searchForm,
        pageNum: this.pageNum || 1,
        pageSize: this.pageSize
      }
      listFinPayment(params).then(res => {
        this.tableData = res.data.paymentList
        this.totalCount = res.data.totalCount
        this.loading = false
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-form-item__label{
  font-weight: 400;
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.pay-record-index{
  .no-message{
    height:120px;
    background:#fff;
    border:1px solid #E8E8E8;
    text-align:center;
    line-height:120px;
    color:#B8B8C5;
    font-size:14px;
  }
  .header{
    color:#29292A;
    margin-bottom:16px;
  }
  .search-form{
    background:#fff;
    border:1px solid #E8E8E8;
    margin-bottom:16px;
    // padding:24px;
    .border{
      padding-top:24px;
      border-bottom:1px solid #E8E8E8;
      .el-input{
        width:360px;
      }
    }
    .el-form-item{
      margin-bottom:16px !important;
    }
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
      width:320px;
    }
  }
  .colorGray{
    color:#9898A1;
  }
  .colorRed{
    color:#F83149;
  }
  .colorGreen{
    color:#2D8459;
  }
  .btn{cursor: pointer}
}
</style>
