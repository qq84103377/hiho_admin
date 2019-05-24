<template>
  <div class="invite-code-index">
    <filterPanel :multiple="false" @selectSearch="userSearch" @submitSearch="keywordSearch" :checkboxInfo="checkboxInfo"
                 :filterText="filterText">
      <div slot="footer">
        <div style="width: 40%;margin-bottom: 16px;" class="select-group">
          <span>使用状态:</span>
          <el-select @change="selectFn" v-model="useType" clearable placeholder="不限">
            <el-option
              v-for="item in options.useType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="width: 40%;margin-bottom: 16px;" class="select-group">
          <span>使用时间:</span>
          <el-date-picker
            @change="selectTime1"
            v-model="useTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div style="width: 40%;" class="select-group">
          <span>生成方式:</span>
          <el-select @change="selectFn" v-model="createType" clearable placeholder="不限">
            <el-option
              v-for="item in options.createType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-left: 48px;" class="select-group">
          <span>生成时间:</span>
          <el-date-picker
            @change="selectTime2"
            v-model="createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
    </filterPanel>
    <el-table
      border
      v-loading="loading"
      :data="tableData"
      style="width: 100%;border: 1px solid #ebeef5;border-bottom: none;margin-top: 16px;"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="code"
        label="邀请码"
        width="140"
        sortable>
      </el-table-column>
      <el-table-column
        prop="vipLevel"
        label="等级"
        width="82"
        sortable>
      </el-table-column>
      <el-table-column
        prop="ownerUserName"
        label="所属用户">
        <template slot-scope="scope">
          <div class="invite-user">
            <span @click="$router.push({path:'/userDetail',query:{id:scope.row.ownerUserId}})">{{scope.row.ownerUserName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="使用状态"
        width="90">
        <template slot-scope="scope">
          <div>{{scope.row.status=='0'?'未使用':'已使用'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="useAt"
        label="使用时间"
        sortable
        width="164">
      </el-table-column>
      <el-table-column
        label="邀请用户">
        <template slot-scope="scope">
          <div class="invite-user">
            <span @click="$router.push({path:'/userDetail',query:{id:scope.row.applyUserId}})">{{scope.row.applyUserName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="生成方式"
        width="136">
        <template slot-scope="scope">
          <div>{{scope.row.type=='0'?'系统生成':'手动生成'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="生成时间"
        sortable
        width="164">
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-col class="page-content">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="20"
        layout="prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
  import {getInviteCodeList, getVipList} from '@/api/user.js'

  export default {
    name: 'inviteCodeIndex',
    data() {
      return {
        loading: false,
        keyword: '',
        tableData: [],
        createTime: '',
        useTime: '',
        createType: '',
        useType: '',
        levelFilter: '',
        filterText: {
          value1: '邀请码搜索',
          value2: '输入邀请码搜索',
          value3: '用户等级'
        },
        checkboxInfo: [],
        options: {
          useType: [{
            value: '0',
            label: '未使用'
          }, {
            value: '1',
            label: '已使用'
          }], createType: [{
            value: '1',
            label: '手动生成'
          }, {
            value: '0',
            label: '系统生成'
          }]
        },
        totalCount: 0,
        useTimeStartFilter: '',
        useTimeEndFilter: '',
        createTimeStartFilter: '',
        createTimeEndFilter: ''
      }
    },
    methods: {
      keywordSearch(v) {
        this.keyword = v
        this.getCodeList()
      },
      selectTime1(v) {
        this.useTimeStartFilter = v ? Number(new Date(v[0])) / 1000 : ''
        this.useTimeEndFilter = v ? (Number(new Date(v[1])) + 86399000) / 1000 : ''
        this.getCodeList()
      },
      selectTime2(v) {
        this.createTimeStartFilter = v ? Number(new Date(v[0])) / 1000 : ''
        this.createTimeEndFilter = v ? (Number(new Date(v[1])) + 86399000) / 1000 : ''
        this.getCodeList()
      },
      selectFn() {
        this.getCodeList()
      },
      userSearch(v) {
        this.levelFilter = v
        this.getCodeList()
      },
      getCodeList(num) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          statusFilter: this.useType,
          typeFilter: this.createType,
          levelFilter: this.levelFilter,
          useTimeStartFilter: this.useTimeStartFilter,
          useTimeEndFilter: this.useTimeEndFilter,
          createTimeStartFilter: this.createTimeStartFilter,
          createTimeEndFilter: this.createTimeEndFilter,
          pageNum: num || 1,
          pageSize: 20,
          sortBy: 'createAt',
          sortType: '1'
        }
        console.log(params, '筛选参数');
        getInviteCodeList(params).then(res => {
          this.loading = false
          this.tableData = res.data.codes
          this.totalCount = res.data.totalCount
        })
      },
      // 分页
      handleCurrentChange(e) {
        this.getCodeList(e)
      },
    },
    created() {
      let params = {onlyVipFlag: 1}
      getVipList(params).then(res => {
        this.checkboxInfo = res.data
      })
      this.getCodeList()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .invite-user {
    > span:hover {
      cursor: pointer;
      border-bottom: 1px solid $sysBlack;
    }
  }
</style>
