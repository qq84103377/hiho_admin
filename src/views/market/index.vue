<template>
  <div class="market-index">
    <content-wrap title="营销消息列表">
      <div slot="btn">
        <el-button type="primary" @click="$router.push('/market/edit')"><i class="iconfont icon-Btn-add"></i> 新建营销消息
        </el-button>
      </div>
    </content-wrap>
    <filterPanel :filterText="filterText" :multiple="false" @submitSearch="keywordSearch">
      <div slot="footer">
        <el-row>
          <el-col :span="7">
            <div class="select-group fs14">
              <span class="mgr10">营销类别:</span>
              <el-select v-model="searchForm.types" multiple placeholder="不限" @change="getMarketManageList">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="select-group fs14">
              <span class="mgr10">消息状态:</span>
              <el-select v-model="searchForm.status" multiple placeholder="不限" @change="getMarketManageList">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="select-group fs14">
              <span class="mgr10">推送时间:</span>
              <el-date-picker
                @change="getMarketManageList"
                v-model="push"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top:16px;">
          <!-- <el-col :span="7">
            <div class="select-group fs14">
              <span class="mgr10">推送形式:</span>
              <el-select v-model="searchForm.statusFilter" clearable placeholder="不限" @change="select">
                <el-option
                  v-for="item in option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col> -->
          <el-col :span="7">
            <div class="select-group fs14">
              <span class="mgr10">是否撤回:</span>
              <el-select v-model="searchForm.isDelete" clearable placeholder="不限" @change="getMarketManageList">
                <el-option
                  v-for="item in isDeleteList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="select-group fs14">
              <span class="mgr10">创建时间:</span>
              <el-date-picker
                v-model="create"
                @change="getMarketManageList"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </div>
    </filterPanel>
    <el-row>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%;border: 1px solid #ebeef5;border-bottom: none;margin-top: 16px;"
        border
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column
          prop="title"
          label="营销主题"
          :sortable="true"
          min-width="220"
          key="title">
          <template slot-scope="scope">
            <div style="display: flex;" :class="scope.row.status == 1 ? 'auxiliaryText': ''">
              <img style="width: 40px;height: 40px;margin-right: 12px;" :src="scope.row.pic" alt="商品图片">
              <div>
                <div>{{scope.row.title}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="营销类别"
          key="type">
          <template slot-scope="scope">
            <div :class="scope.row.status == 1 ? 'auxiliaryText': ''">{{typeMap[scope.row.type]}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="pushAt"
          label="推送时间"
          min-width="110"
          :sortable="true"
          key="pushAt">
          <template slot-scope="scope">
            <div :class="scope.row.status == 1 ? 'auxiliaryText': ''">{{scope.row.pushAt}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isDelete"
          label="是否撤销"
          key="isDelete">
          <template slot-scope="scope">
            <div :class="scope.row.status == 1 ? 'auxiliaryText': ''">{{isDeleteMap[scope.row.isDelete]}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          key="status">
          <template slot-scope="scope">
            <div :class="scope.row.status == 1 ? 'auxiliaryText': ''">{{statusMap[scope.row.status]}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createAt"
          label="创建时间"
          min-width="110"
          :sortable="true"
          key="createAt">
          <template slot-scope="scope">
            <div :class="scope.row.status == 1 ? 'auxiliaryText': ''">{{scope.row.createAt}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160">
          <template slot-scope="scope">
            <div class="table-btn">
              <el-button type="text" size="small"
                         @click="getCancel(scope.row.id)" class="look" v-if="scope.row.status == 0">
                <i class="iconfont icon-icon-recall mgr5"></i><span class="fs14">撤销</span></el-button>
              <el-button type="text" size="small"
                         @click="$router.push({path:'/market/detail',query:{id:scope.row.id}})" class="look">
                <i class="iconfont icon-check mgr5 sysBlue"></i><span class="sysBlue fs14">查看</span></el-button>
            </div>
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
    </el-row>
  </div>
</template>
<script>
  import {getMarketManageList, cancelMarketManage} from '@/api/market.js'

  export default {
    name: 'marketIndex',
    data() {
      return {
        filterText: {
          value1: '消息搜索',
          value2: '输入营销主题搜索',
        },
        typeList: [
          {value: 'ACTIVITY', label: '活动'},
          {value: 'BRAND', label: '品牌'},
          {value: 'NOTICE', label: '公告'}
        ],
        statusList: [
          {value: '0', label: '未开始'},
          {value: '1', label: '已撤销'},
          {value: '2', label: '已完成'}
        ],
        isDeleteList: [
          {value: '0', label: '否'},
          {value: '1', label: '是'}
        ],
        typeMap: {'ACTIVITY': '活动', 'BRAND': '品牌', 'NOTICE': '公告'},
        statusMap: {'0': '未开始', '1': '已撤销', '2': '已完成'},
        isDeleteMap: {'0': '否', '1': '是'},
        searchForm: {
          types: [],
          status: [],
          pushStartTime: '',
          pushEndTime: '',
          createStartTime: '',
          createEndTime: '',
          isDelete: '',
          keyword: ''
        },
        push: '',
        create: '',
        tableData: [],
        loading: false,
        pageSize: 10,
        pageNum: 1,
        totalCount: 0
      }
    },
    methods: {
      // 撤销
      getCancel(id) {
        let params = {
          id: id
        }
        cancelMarketManage(params).then(res => {
          this.$message.success(res.msg)
          this.getMarketManageList()
        })
      },
      // 分页
      handleCurrentChange(pageNum) {
        this.pageNum = pageNum
        this.getMarketManageList()
      },
      keywordSearch(v) {
        this.keyword = v
        this.getMarketManageList()
      },
      getMarketManageList() {
        this.loading = true
        let params = {
          keyword: this.keyword,
          types: this.searchForm.types.length == 3 ? [] : this.searchForm.types,
          status: this.searchForm.status.length == 3 ? [] : this.searchForm.status,
          pushStartTime: this.push ? (Number(new Date(this.push[0]))) / 1000 : '',
          pushEndTime: this.push ? (Number(new Date(this.push[1])) + 86399000) / 1000 : '',
          createStartTime: this.create ? (Number(new Date(this.create[0]))) / 1000 : '',
          createEndTime: this.create ? (Number(new Date(this.create[1])) + 86399000) / 1000 : '',
          isDelete: this.searchForm.isDelete,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          sortBy: 'createAt',
          sortType: '1'
        }
        getMarketManageList(params).then(res => {
          this.loading = false
          this.tableData = res.data ? res.data.marketManages : []
          this.totalCount = res.data.totalCount
        })
      }
    },
    created() {
      this.getMarketManageList()
    }
  }
</script>
<style lang="scss" scoped>
  .market-index {
    .table-btn {
      display: flex;
      justify-content: center;
    }
    .look {
      margin-left: -10px;
    }
  }
</style>
<style lang="scss">
  .market-edit {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 200px !important;
    }
  }
</style>


