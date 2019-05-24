<template>
  <div>
    <el-table
      border
      :data="tableData"
      style="width: 100%;border: 1px solid #ebeef5;border-bottom: none;margin-top: 16px;"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="name"
        :label="`注册用户(${totalCount})`"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
        width="149">
      </el-table-column>
      <el-table-column
        prop="vipLevel"
        label="用户等级"
        width="149">
        <template slot-scope="scope">
          <div :class="['level-flag',{'visitor':scope.row.vipLevel=='游客'}]">{{scope.row.vipLevel}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="hasWx"
        label="关联微信"
        width="149">
        <template slot-scope="scope">
          <div>{{scope.row.hasWx=='1'?'已关联':'未关联'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderSum"
        label="累计下单件数"
        sortable
        width="149">
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="注册时间"
        sortable
        width="172">
      </el-table-column>
      <el-table-column
        label="操作"
        width="80">
        <template slot-scope="scope">
          <div style="color: #3C8EEF;cursor: pointer;" class="iconfont icon-check" @click="$router.push({path:'/userDetail',query:{id:scope.row.id}})">查看</div>
        </template>
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
  export default {
    name: 'userList',
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

      }
    },
    methods: {
      // 分页
      handleCurrentChange(e) {
        this.$emit('handleCurrentChange',e)
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .level-flag{
    width: 50px;
    line-height: 28px;
    color: $sysGolden;
    background: $sysBlack;
    text-align: center;
    &.visitor{
      background: #EBEBF2;
      color: $auxiliaryText;
    }
  }
</style>

