<template>
  <div class="order-index">
    <el-menu :default-active="$route.path" class="content-wrap" mode="horizontal" @select="handleSelect">
      <el-menu-item class="menu-item" index="/order/index/salesList">订单列表</el-menu-item>
      <el-menu-item class="menu-item" index="/order/index/afterSalesList">售后单列表</el-menu-item>
    </el-menu>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'orderIndex',
  data() {
    return {

    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push({path:key})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
