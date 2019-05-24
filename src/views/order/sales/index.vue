<template>
  <div class="sales-order-index">
    <div>
      <!-- 查询条件 -->
      <filterPanel v-if="$route.path=='/order/index/salesList'" :multiple="true" @selectSearch="brandSearch" @submitSearch="keywordSearch"
                   :checkboxInfo="brandList" :filterText="filterText">
        <div slot="action-btn" style="float: right;">
          <el-button @click="openExport" size="medium">导出数据</el-button>
          <el-button @click="isBatchDelivery=true" size="medium">批量发货</el-button>
        </div>
        <div slot="footer">
          <el-row>
            <el-col :span="21">
              <el-col :span="7">
                <div class="select-group fs14">
                  <span class="mgr10">选择商品:</span>
                  <el-select @change="getOrderList" filterable v-model="filter.goodsFilters" multiple clearable
                             placeholder="不限">
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
                  <el-select @change="getOrderList" filterable v-model="filter.userFilters" multiple clearable
                             placeholder="不限">
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
                  <span class="mgr10">售后状态:</span>
                  <el-select @change="getOrderList" v-model="filter.refundStatusFilter" clearable placeholder="不限">
                    <el-option
                      v-for="item in refundStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-col>
            <el-col :span="3">
              <div class="select-btn" @click="searchShow = !searchShow">更多筛选条件<i
                :class="['select-iocn', searchShow ? 'el-icon-arrow-up ' : 'el-icon-arrow-down']"></i>
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
      <el-radio-group v-if="$route.path=='/order/index/salesList'" v-model="filter.status" style="margin:18px 0 0;" @change="changePayStatus">
        <el-radio-button label="" class="">全部</el-radio-button>
        <el-radio-button label="WAIT_PAY">待付款</el-radio-button>
        <el-radio-button label="WAIT_SEND">待发货</el-radio-button>
        <el-radio-button label="SENDED">已发货</el-radio-button>
      </el-radio-group>
      <!-- 表格 -->
      <sales-list v-loading="loading" @success="getOrderList" @handleCurrentChange="v => handleCurrentChange(v)" :totalCount="totalCount" :tableData="orderList" :pageSize="10"></sales-list>
    </div>
    <!--<deliver-goods-dialog @deliverSuccess="getOrderList" :orderId="deliverOrderId"-->
                          <!--:visible.sync="deliverGoodsDialogVisible"></deliver-goods-dialog>-->
    <!--导出数据弹层-->
    <el-dialog
      title="导出数据"
      :visible.sync="isExportVisible"
      width="480px">
      <span>是否确认导出当前列表中所有数据，系统将以Excel(.xls)格式导出</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isExportVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportOrdersExcel">确定</el-button>
      </span>
    </el-dialog>
    <!--批量发货弹层-->
    <el-dialog
      title="批量发货"
      :visible.sync="isBatchDelivery"
      width="480px">
      <div class="text-left">
        <p>1.下载 <span @click="downloadTemplate" class="sysBlue pointer">批量发货模板文件</span></p>
        <p>2.编辑模板中的：订单编号、物流公司、物流单号</p>
        <p>3.上传模板文件，确认操作后对应的订单状态就会自动发货</p>
        <!--application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,-->
        <div class="pdt8 pdb8">
          <el-upload
            ref="uploadExcel"
            action=""
            accept="application/vnd.ms-excel"
            :http-request="confirmUploadExcel"
            name="file"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
            :on-exceed="checkUploadFiles"
            :file-list="fileList">
            <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
          </el-upload>
        </div>
        <p class="fs12 sysRed">温馨提示：每次批量操作的订单数最好不超过1000条，否则响应较慢</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isBatchDelivery = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getOrderList, batchDelivery, getOrdersExcel, getBatchDeliveryXlsUrl } from '@/api/order.js'
  import { listBrand } from '@/api/brand.js'
  import { listGoods } from '@/api/goods.js'
  import { getUserList } from '@/api/user.js'
  // import deliverGoodsDialog from './components/deliverGoodsDialog'
  import salesList from './components/salesList'
  export default {
    name: 'salesOrderIndex',
    data() {
      return {
        loading: false,
        filter: {
          keyword: '',
          goodsFilters: [],
          userFilters: [],
          brandFilters: [],
          statusFilter: '',
          refundStatusFilter: '',
          createOrderStartTimeFilter: '',
          createOrderEndTimeFilter: '',
          pageNum: 1,
          pageSize: 10,
          sortBy: 'orderAt',
          sortType: '1'
        },
        filterText: {
          value1: '订单搜索',
          value2: '输入订单号搜索',
          value3: '订单搜索'
        },
        searchShow: false,
        totalCount: 0,
        orderList: [],
        brandList: [],
        goodList: [],
        userList: [],
        refundStatusList: [
          {alue: '', label: '全部'},
          {value: '1', label: '有售后'},
          {value: '0', label: '无售后'}
        ],
        orderTime: '',
        deliverGoodsDialogVisible: false,
        deliverOrderId: '',
        isExportVisible: false,
        isBatchDelivery: false,
        fileList: []
      }
    },
    methods: {
      // 打开导出弹窗
      openExport () {
        if (this.orderList.length == 0) return this.$message.error('请组合筛选条件查询数据')
        this.isExportVisible = true
      },
      // 通过支付状态筛选
      changePayStatus(val) {
        this.filter.statusFilter = val
        this.getOrderList()
      },
      // 获取订单列表
      getOrderList() {
        this.loading = true
        getOrderList(this.filter).then(res => {
          this.loading = false
          if (res.code === 0) {
            this.orderList = res.data.orders
            this.totalCount = res.data.totalCount
            // this.$emit('saleTotal',this.totalCount)
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
        const params = {
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
        this.filter.brandFilters = v
        this.getOrderList()
      },
      // 通过关键词搜索
      keywordSearch(v) {
        this.filter.keyword = v
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
        this.filter.createOrderStartTimeFilter = v ? Number(new Date(v[0])) / 1000 : ''
        this.filter.createOrderEndTimeFilter = v ? (Number(new Date(v[1])) + 86399000) / 1000 : ''
        console.log(this.filter, '选择时间后')
        this.getOrderList()
      },
      // 显示订单商品明细
      showPopover(index) {
        this.$set(this.orderList[index], 'isShowPopover', true)
      },
      // 隐藏订单商品明细
      hidePopover(index) {
        this.$set(this.orderList[index], 'isShowPopover', false)
      },
      // 显示发货弹窗
      deliverGoods(id) {
        this.deliverOrderId = id
        this.deliverGoodsDialogVisible = true
      },
      // 上传excel，进行批量发货操作
      confirmUploadExcel(params) {
        if (this.$refs.uploadExcel.uploadFiles.length === 0) {
          this.$message.error('请上传文件')
          return
        }
        const uploading = this.$loading({
          lock: true,
          text: '批量发货中,请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        // 添加请求头
        const config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        const form = new FormData()
        form.append('file', params.file)
        this.isBatchDelivery = false
        batchDelivery(form, config).then(res => {
          uploading.close()
          this.$refs.uploadExcel.clearFiles()
          if (res.code === 0) {
            this.$message.success('批量发货成功')
          }
        })
      },
      uploadExcel() {
        this.$refs.uploadExcel.submit()
      },
      checkUploadFiles(files, fileList) {
        this.fileList = [files[0]]
      },
      // 批量导出订单
      exportOrdersExcel() {
        this.isExportVisible = false
        const uploading = this.$loading({
          lock: true,
          text: '订单导出中,请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        getOrdersExcel(this.filter).then(res => {
          uploading.close()
          if (!res) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([res]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '订单列表' + this.currentTime() + '.xls')
          document.body.appendChild(link)
          link.click()
          link.remove()
        }).catch(function (res) {
          console.log(res)
        })
      },
      // 下载批量发货模板文件
      downloadTemplate() {
        let params = {}
        getBatchDeliveryXlsUrl(params).then(res => {
          if(res.code === 0){
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = res.data
            link.setAttribute('download', '批量发货模版文件' + this.currentTime() + '.xls')
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
          console.log('下载成功')
        })
      },
      // 获取当前时间
      currentTime() {
        var now = new Date()
        var year = now.getFullYear()
        var month = now.getMonth() + 1
        var day = now.getDate()

        var hh = now.getHours()
        var mm = now.getMinutes()
        var ss = now.getSeconds()

        var clock = year + '-'

        if (month < 10)
          clock += '0'

        clock += month + '-'

        if (day < 10)
          clock += '0'

        clock += day + ' '

        if (hh < 10)
          clock += '0'

        clock += hh + '-'
        if (mm < 10) clock += '0'
        clock += mm + '-'

        if (ss < 10) clock += '0'
        clock += ss
        return clock
      }
    },
    components: {
      salesList
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

  .sales-order-index {
    //  重写标签页样式
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #fff;
      color: $mainText;
      border-color: $inputBorder;
      box-shadow: -1px 0 0 0 $inputBorder;
    }
    .el-radio-button__inner {
      background-color: $lightBg;
      color: $auxiliaryText;
      &:hover {
        color: $auxiliaryText;
        background-color: #fff;
      }
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .sales-order-index {
    .detail-btn {
      border: 1px solid $divideBorder;
      background: $divideBorder;
      padding: 4px 13px;
      &.active {
        color: $sysBlack;
        background: $sysGolden;
        border: 1px solid $sysGolden;
      }
    }
    .content {
      margin-top: 16px;
      height: 96px;
      border: 1px solid #E8E8E8;
      background: rgba(255, 255, 255, 1);
      line-height: 96px;
      text-align: center;
      .text {
        margin: 0 !important;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        color: rgba(184, 184, 197, 1);
      }
    }
    .select-btn {
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: #29292A;
      cursor: pointer;
      text-align: right;
      .select-iocn {
        margin-left: 5px;
      }
    }
    .el-table .el-button {
      width: 56px;
    }
    .look {
      color: $sysBlue;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>

