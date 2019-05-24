<template>
  <div class="activity-index">
    <div class="content-wrap header"  v-if="$route.path=='/activity/index'">
      <div class="menu-item">活动管理</div>
      <el-button class="action-btn el-button--primary" @click="$router.push('/activity/edit')">新建活动</el-button>
    </div>
    <!-- 查询条件 -->
    <filterPanel :checkboxInfo="brandList" :filterText="filterText" :multiple="false" @submitSearch="keywordSearch"
                 @selectSearch="brandSearch" v-if="$route.path=='/activity/index'">
      <div slot="footer">
        <el-row>
          <el-col :span="21">
            <el-col :span="7">
              <div class="select-group fs14">
                <span class="mgr10">活动状态:</span>
                <el-select v-model="searchForm.statusFilter" clearable placeholder="不限" @change="selectFn">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="select-group fs14">
                <span class="mgr10">销售情况:</span>
                <el-select v-model="searchForm.saleFilter" clearable placeholder="不限" @change="selectFn">
                  <el-option
                    v-for="item in situationList"
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
                  v-model="searchForm.creatTime"
                  @change="selectTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </el-col>
          </el-col>
          <el-col :span="3">
            <div class="select-btn" @click="searchShow = !searchShow">更多筛选条件<i
              :class="['select-iocn', searchShow ? 'el-icon-arrow-up ' : 'el-icon-arrow-down']"></i></div>
          </el-col>
        </el-row>
        <transition name="fade">
          <div class="search" v-show="searchShow">
            <el-row>
              <el-col :span="9">
                <div class="select-group fs14">
                  <span class="mgr10">开始时间:</span>
                  <el-date-picker
                    v-model="searchForm.startTime"
                    @change="selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-col>
              <el-col :span="9">
                <div class="select-group fs14">
                  <span class="mgr10">结束时间:</span>
                  <el-date-picker
                    v-model="searchForm.endTime"
                    @change="selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>
          </div>
        </transition>

      </div>
    </filterPanel>

    <activity-list @handleCurrentChange="v => getActivityList(v)" v-loading="loading" :tableData="tableData" :totalCount="totalCount" :pageSize="pageSize"></activity-list>
  </div>
</template>

<script>
  import {listActivity} from '@/api/activity.js'
  import {listBrand} from '@/api/brand.js'
  // import countDown from './components/countdown.vue'
  import countDown from './components/countdown.vue'
  import activityList from './components/activity-list'

  export default {
    name: 'activityList1',
    components: { countDown, activityList },
    props: {
      brandId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        searchForm: {statusFilter: '', saleFilter: '', creatTime: '', startTime: '', endTime: ''},
        brandList: [],
        sorttable: [], // 排序
        keyword: '',
        time: '',
        brandFilter: '',
        filterText: {
          value1: '活动搜索',
          value2: '输入活动名称搜索',
          value3: '商品品牌',
        },
        statusList: [
          {alue: '', label: '全部'},
          {value: 'notStart', label: '未开始'},
          {value: 'ongoing', label: '进行中'},
          {value: 'end', label: '已结束'}
        ],
        situationList: [
          {alue: '', label: '全部'},
          {value: 'hasSale', label: '有销量'},
          {value: 'noSale', label: '销量为0'}
        ],

        activityStartTimeStartFilter: '',
        activityStartTimeEndFilter: '',
        activityEndTimeStartFilter: '',
        activityEndTimeEndFilter: '',
        activityCreateTimeStartFilter: '',
        activityCreateTimeEndFilter: '',
        pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        searchShow: false,
        loading: false,
        tableData: [{activity: '12577'}, {activity: '12577'}],
        detailType: 'add' // 添加
      }
    },
    methods: {
      add() {
        this.showEdit = true
        this.detailType = 'add'
      },
      brandSearch(v) {
        this.brandFilter = v
        this.getActivityList()
      },
      keywordSearch(v) {
        this.keyword = v
        this.getActivityList()
      },
      selectFn() {
        this.getActivityList()
      },
      selectTime() {
        this.activityStartTimeStartFilter = this.searchForm.startTime ? Number(new Date(this.searchForm.startTime [0])) / 1000 : ''
        this.activityStartTimeEndFilter = this.searchForm.startTime ? (Number(new Date(this.searchForm.startTime[1])) + 86399000) / 1000 : ''
        this.activityEndTimeStartFilter = this.searchForm.endTime ? Number(new Date(this.searchForm.endTime [0])) / 1000 : ''
        this.activityEndTimeEndFilter = this.searchForm.endTime ? (Number(new Date(this.searchForm.endTime[1])) + 86399000) / 1000 : ''
        this.activityCreateTimeStartFilter = this.searchForm.creatTime ? Number(new Date(this.searchForm.creatTime [0])) / 1000 : ''
        this.activityCreateTimeEndFilter = this.searchForm.creatTime ? (Number(new Date(this.searchForm.creatTime[1])) + 86399000) / 1000 : ''
        this.getActivityList()
      },
      // 品牌
      getBrandList() {
        let params = {
          keyword: '',
          pageNum: 0,
          pageSize: 0
        }
        listBrand(params).then(res => {
          console.log(res, '品牌列表')
          this.brandList = res.data.brandOneResponseList
          sessionStorage.setItem('brandList', JSON.stringify(this.brandList))
        })
      },
      // 获取数据
      getActivityList(num) {
        this.loading = true
        let params = {
          brandFilter: this.brandFilter || this.brandId,
          keyword: this.keyword,
          activityStartTimeStartFilter: this.activityStartTimeStartFilter,
          activityStartTimeEndFilter: this.activityStartTimeEndFilter,
          activityEndTimeStartFilter: this.activityEndTimeStartFilter,
          activityEndTimeEndFilter: this.activityEndTimeEndFilter,
          activityCreateTimeStartFilter: this.activityCreateTimeStartFilter,
          activityCreateTimeEndFilter: this.activityCreateTimeEndFilter,
          statusFilter: this.searchForm.statusFilter || '',
          saleFilter: this.searchForm.saleFilter || '',
          pageNum: num || 1,
          pageSize: this.pageSize,
          sortBy: 'createAt',
          sortType: '1'
        }
        listActivity(params).then(res => {
          this.tableData = res.data.activities
          this.totalCount = res.data.totalCount
          // this.$emit('total', this.totalCount)
          this.loading = false
        })
      },
    },
    created() {
      this.getActivityList()
      this.getBrandList()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .activity-index {
    .header {
      height: 60px;
      line-height: 60px;
    }
    .el-button--small {
      width: 56px !important;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .activity-index {
    .content-wrap {
      width: 100%;
    }

    .menu-item {
      color: $sysBlack;
    }
    .content {
      height: 96px;
      border: 1px solid $divideBorder;
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
    .main {
      border: 1px solid $divideBorder;
    }
    .el-input__inner {
      border-radius: 0 !important;
      width: 80% !important;
    }
    .select-btn {
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: $mainText;
      cursor: pointer;
      text-align: right;
      .select-iocn {
        margin-left: 5px;
      }
    }
    .look {
      color: $sysBlue;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
