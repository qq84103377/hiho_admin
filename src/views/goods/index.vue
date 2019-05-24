<template>

  <div class="goods-index">
    <el-menu :default-active="$route.path" class="content-wrap" mode="horizontal" @select="handleSelect">
      <el-menu-item class="menu-item" index="/goods/index/goodsList">商品列表</el-menu-item>
      <el-menu-item class="menu-item" index="/goods/index/brandList">品牌列表</el-menu-item>
      <el-button class="action-btn iconfont icon-Btn-add" type="primary"
                 @click="$route.path=='/goods/index/goodsList'?$router.push('/goodsEdit'):addBrandPop = true">
        {{$route.path=='/goods/index/goodsList'?'新建商品':'新建品牌'}}
      </el-button>
    </el-menu>
    <transition name="fade" mode="out-in">
      <router-view ref="child"></router-view>
    </transition>

    <!--新建品牌侧边栏-->
    <brand-pop @confirm="confirm" :popShow.sync="addBrandPop"></brand-pop>
  </div>
</template>

<script>
  export default {
    name: 'goodsIndex',
    data() {
      return {
        addBrandPop: false,
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.push({path: key})
        console.log(key, keyPath)
      },
      confirm() {
        this.$refs.child.getBrandList()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
