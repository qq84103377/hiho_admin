<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;border: 1px solid #ebeef5;border-bottom: none;margin-top: 16px;"
      border
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="name"
        label="活动"
        :sortable="true"
        min-width="220'"
        key="name">
        <template slot-scope="scope">
          <div style="display: flex;">
            <img style="width: 40px;height: 40px;margin-right: 12px;" :src="scope.row.picturePath" alt="商品图片">
            <div>
              <div>{{scope.row.name}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$route.path=='/activity/index'"
        prop="brand"
        label="品牌"
        min-width="220'"
        key="brand">
        <template slot-scope="scope">
          <div>{{scope.row.brand}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        :sortable="true"
        min-width="164'"
        key="startTime">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        :sortable="true"
        min-width="164'"
        key="endTime">
      </el-table-column>
      <el-table-column
        prop="goodsKindSum"
        label="商品款数"
        :sortable="true"
        min-width="105'"
        key="goodsKindSum">
      </el-table-column>
      <el-table-column
        prop="saleSum"
        label="销量总计"
        :sortable="true"
        min-width="105'"
        key="saleSum">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :sortable="true"
        width="170"
        key="status">
        <template slot-scope="scope">
          <div v-if="scope.row.status !== 'end'">
            <div class="auxiliaryText">
              <div :class="['fs14', scope.row.status == 'ongoing' ? 'sysBlue' : '']">
                {{statusMap[scope.row.status]}}
              </div>
              <count-down @clockerEnd="clockerEnd(scope.$index)" v-if="scope.row.endTime"
                          :startTime="scope.row.startTime" :endTime="scope.row.endTime"
                          :status="scope.row.status"></count-down>
            </div>
          </div>
          <div v-else style="color:#29292A;">{{statusMap[scope.row.status]}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="创建时间"
        min-width="164'"
        key="createAt">
      </el-table-column>
      <el-table-column
        prop="activity"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button style="width: 56px;" type="text" size="small"
                     @click="$router.push(`/activity/detail?id=${scope.row.id}`)">
            <i class="iconfont icon-check mgr5 sysBlue"></i><span class="look fs14">查看</span></el-button>
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
  </div>
</template>

<script>
  // import {listActivity} from '@/api/activity.js'
  // import {listBrand} from '@/api/brand.js'
  // import countDown from './components/countdown.vue'
  import countDown from './countdown.vue'

  export default {
    name: 'activityList',
    components: {countDown},
    props: {
      tableData: {
        type: Array,
        default () {
          return []
        }
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
    data() {
      return {
        statusMap: {
          'notStart': '未开始',
          'ongoing': '进行中',
          'end': '已结束'
        },
      }
    },
    methods: {
      // 分页
      handleCurrentChange(e) {
        this.$emit('handleCurrentChange',e)
      },
      clockerEnd(index) {
        this.$set(this.tableData[index], 'status', 'end')
      }
    },
  }
</script>

