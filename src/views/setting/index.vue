<template>
  <div class="pay-record-index">
    <el-menu :default-active="$route.path" class="content-wrap" mode="horizontal" @select="handleSelect">
      <el-menu-item v-for="(item,index) in tabList" :key="index" class="menu-item" :index="`/setting/index/${item.path}`">{{item.name}}</el-menu-item>
      <el-button v-if="$route.path=='/setting/index/freightTemplate'||userGuide" class="action-btn iconfont icon-Btn-add"
                 type="primary" @click="userGuide?$refs['child'].addCate():$refs['child'].addTemplate()">{{userGuide?'添加说明分类':'新增模板'}}
      </el-button>
    </el-menu>

    <transition name="fade" mode="out-in">
      <router-view ref="child"></router-view>
    </transition>
  </div>
</template>

<script>

  export default {
    name: 'payRecordIndex',
    data() {
      return {
        tabList: [
          {name: '后台账户', path: 'adminAccount'},
          {name: '运费模板', path: 'freightTemplate'},
          {name: '退货地址', path: 'returnAddress'},
          {name: '用户指南', path: 'userGuide'}
        ]
      }
    },
    computed: {
      userGuide() {
        return this.$route.path == '/setting/index/userGuide'
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.push({path: key})
        console.log(key, keyPath)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
