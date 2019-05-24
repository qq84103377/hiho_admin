<template>
  <div class="grade-index">
    <el-table
      border
      :data="tableData"
      style="width: 100%;border: 1px solid #ebeef5;border-bottom: none;margin-top: 16px;"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="level"
        label="用户等级"
        width="200">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'gradeIndex',
  data() {
    return {
      tableData: [{
        desc: '注册后的默认等级。可以查看商品，但无法进行加入购物车、关注、下单等操作。',
        level: '游客'
      },{
        desc: '通过邀请码升级。可以进行 APP中的所有操作。',
        level: 'VIP 1'
      }],
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
