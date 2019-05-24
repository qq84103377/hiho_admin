<template>
  <div class="customer-index">
    <filterPanel @selectSearch="userSearch" @submitSearch="keywordSearch" :multiple="false" :checkboxInfo="checkboxInfo" :filterText="filterText" v-if="$route.path == '/user/index/customer'">

      <div slot="footer">
        <div class="select-group">
          <span>关联微信:</span>
          <el-select @change="selectFn" v-model="hasWx" clearable placeholder="不限">
            <el-option
              v-for="item in options.hasWxFilter"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-group">
          <span>下单情况:</span>
          <el-select @change="selectFn" v-model="order" clearable placeholder="不限">
            <el-option
              v-for="item in options.orderFilter"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-group">
          <span>注册时间:</span>
          <el-date-picker
            @change="selectTime"
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
    </filterPanel>
    <user-list @handleCurrentChange="v => getUserListFn(v)" v-loading="loading" :tableData="tableData" :totalCount="totalCount" :pageSize="20"></user-list>
  </div>
</template>

<script>
  import {getUserList, getVipList} from '@/api/user.js'
  import userList from './components/user-list'
  export default {
    name: 'userIndex',
    // props: ['brandId','actId','goodsId'],
    data() {
      return {
        loading: false,
        tableData: [],
        keyword: '',
        levelFilter: '',
        hasWx: '',
        order: '',
        time: '',
        filterText: {
          value1: '用户搜索',
          value2: '输入用户名或手机号码搜索',
          value3: '用户等级'
        },
        checkboxInfo: [],
        options: {
          hasWxFilter: [{
            value: '1',
            label: '已关联'
          }, {
            value: '0',
            label: '未关联'
          }], orderFilter: [{
            value: '1',
            label: '有下单'
          }, {
            value: '0',
            label: '从未下单'
          }]
        },
        createAtStartFilter: '',
        createAtEndFilter: '',
        totalCount: 0
      }
    },
    components:{ userList },
    methods: {
      keywordSearch(v) {
        this.keyword = v
        this.getUserListFn()
      },
      userSearch(v) {
        this.levelFilter = v
        this.getUserListFn()
      },
      selectTime(v) {
        this.createAtStartFilter = v ? Number(new Date(v[0])) / 1000 : ''
        this.createAtEndFilter = v ? (Number(new Date(v[1])) + 86399000) / 1000 : ''
        this.getUserListFn()
      },
      selectFn() {
        this.getUserListFn()
      },
      getUserListFn(num) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          levelFilter: this.levelFilter,
          hasWxFilter: this.hasWx,
          orderFilter: this.order,
          createAtStartFilter: this.createAtStartFilter,
          createAtEndFilter: this.createAtEndFilter,
          pageNum: num || 1,
          pageSize: 20,
          sortBy: 'createAt',
          sortType: '1'
        }
        console.log(params,'筛选参数');
        getUserList(params).then(res => {
          console.log(res);
          this.loading = false
          this.totalCount = res.data.totalCount
          this.tableData = res.data.users
        })
      }
    },
    created() {
      let params = { onlyVipFlag: 0 }
      getVipList(params).then(res => {
        this.checkboxInfo = res.data
      })
      this.getUserListFn()
    }
  }
</script>
