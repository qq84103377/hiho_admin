<template>
  <div class="business-detail">
    <content-wrap title="邀请用户销售业绩报表">
      <div slot="btn">
        <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      </div>
    </content-wrap>
    <div class="form">
      <el-form :model="form" :inline="true">
        <el-form-item label="所属用户">
          <el-select v-model="form.ownerUserIds" multiple filterable placeholder="请选择" @change="getSalesPerformance">
            <el-option
              v-for="item in userList"
              :key="item.ownerUserId"
              :label="item.phone"
              :value="item.ownerUserId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="deteTime"
            @change="getSalesPerformance"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <div style="float:right">
          <el-button @click="isExportVisible=true" size="medium">导出数据</el-button>
        </div>
      </el-form>
    </div>
    <div class="title">
      销售业绩汇总：{{totalAmount}}元
    </div>
    <el-row>
       <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="ownerUserPhone"
          align="center"
          label="所属用户">
        </el-table-column>
        <el-table-column
          prop="applySales"
          align="center"
          label="邀请用户">
          <template slot-scope="scoped">
            <div class="table-item" v-for="(item,index) in scoped.row.applySales" :key="index">{{item.phone}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          align="center"
          label="销售业绩(元)">
          <template slot-scope="scoped">
            <div class="table-item" v-for="(item,index) in scoped.row.applySales" :key="index">{{item.personAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="personTotal"
          label="总销售业绩(元)">
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
    </el-row>
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
  </div>
</template>
<script>
  import { getUserSimples, getSalesPerformance, getSalesExcel } from '@/api/business.js'
export default {
  name:'businessDetail',
  data() {
    return {
      totalAmount: 0,
      form: {
        ownerUserIds: [],
        startTime: '',
        endTime: ''
      },
      userList: {},
      deteTime: null,
      isExportVisible: false,
      tableData: [],
      pageNum: 1,
      pageSize: 20,
      totalCount: 0
    }
  },
  methods: {
    // 导出
    exportOrdersExcel () {
      this.isExportVisible = false
      let params = {
        ownerUserIds: this.form.ownerUserIds,
        startTime: this.deteTime ? Number(new Date(this.deteTime [0])) / 1000 : '',
        endTime: this.deteTime ? (Number(new Date(this.deteTime [1])) + 86399000) / 1000 : '',
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      const uploading = this.$loading({
        lock: true,
        text: '报表导出中,请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getSalesExcel(params).then(res => {
        uploading.close()
        if (!res) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([res]))
        console.log(url)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '业绩报表' + this.currentTime() + '.xls')
        document.body.appendChild(link)
        link.click()
        link.remove()
      }).catch(function (res) {
        console.log(res)
      })
    },
    // 分页
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.getSalesPerformance()
    },
    // 用户列表
    getUserSimples () {
      getUserSimples().then(res => {
        this.userList = res.data.userSimpleResponses
      })
    },
    // 表格
    getSalesPerformance() {
      let params = {
        ownerUserIds: this.form.ownerUserIds,
        startTime: this.deteTime ? Number(new Date(this.deteTime [0])) / 1000 : '',
        endTime: this.deteTime ? (Number(new Date(this.deteTime [1])) + 86399000) / 1000 : '',
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getSalesPerformance (params).then(res => {
        if (res.data) {
          this.tableData = res.data.salesPerformanceResponses
          this.totalAmount = res.data.totalAmount
          this.totalCount = res.data.totalCount
          }
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
  created () {
    this.getUserSimples()
    this.getSalesPerformance()
  }
}
</script>
<style lang="scss" scoped>
.business-detail{
  .form{
    background-color: #fff;
    padding: 24px 24px;
  }
  .title{
    padding:24px;
    margin:15px 0;
    background-color: #fff;
    font-size:18px;
  }
  .table-item{
    height:32px;
    line-height: 32px;
    border-top: 1px solid #ebeef5;
    &:first-child{
      border:none;
    }
  }
}
</style>
<style lang="scss">
.business-detail {
  .el-form-item{
    margin-bottom:0;
  }
  .el-table td{
    padding:0;
  }
  .el-table .cell{
    padding:0;
  }
  .el-range-editor.el-input__inner{
    height:40px !important;
    line-height: 40px;
  }
}

</style>


