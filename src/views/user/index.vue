<template>
  <div class="setting-index">
    <el-menu :default-active="$route.path" class="content-wrap" mode="horizontal" @select="handleSelect">
      <el-menu-item class="menu-item" index="/user/index/customer">注册用户列表</el-menu-item>
      <el-menu-item class="menu-item" index="/user/index/inviteCode">邀请码</el-menu-item>
      <el-menu-item class="menu-item" index="/user/index/grade">用户等级</el-menu-item>
      <el-button v-if="$route.path == '/user/index/inviteCode'" class="action-btn" type="primary" @click="$refs.pop.codePopShow()">
        新增邀请码
      </el-button>
    </el-menu>
    <transition name="fade" mode="out-in">
      <router-view ref="list"></router-view>
    </transition>

    <!--新增邀请码-->
    <create-code-pop @close="$refs.list.getCodeList()" ref="pop"></create-code-pop>
  </div>
</template>

<script>

  export default {
    name: 'settingIndex',
    data() {
      return {
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
