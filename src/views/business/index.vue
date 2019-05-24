<template>
  <div class="business-index">
    <content-wrap title="业务报表">
    </content-wrap>
    <div class="tab">
      <div class="text fs14">
        <i class="iconfont icon-icon_reportx sysBlue"></i>邀请用户-销售业绩报表
      </div>
      <el-button size="small"  @click="$router.push('/businessDetail')">查看报表 >></el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'businessIndex',
  methods: {
    go() {
      this.$router.push('/business/detail')
    }
  }
}
</script>

<style lang="scss" scoped>
.business-index{
  .tab{
    padding: 17px 24px;
    background-color: #fff;
    display:flex;
    justify-content: space-between;
    .text{
      height:36px;
      line-height: 36px;
      i{
        margin-right:8px;
      }
    }
  }
}
</style>
