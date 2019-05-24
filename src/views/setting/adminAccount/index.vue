<template>
  <div class="admin-account-index">
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      height="500"
      style="width: 100%">
      <el-table-column
        prop="phone"
        label="账户">
      </el-table-column>
      <el-table-column
        prop="authority"
        label="权限">
      </el-table-column>
      <el-table-column
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dialogShow('edit', scope.row.id)" style="width:60px"><i class="iconfont icon-edit mgr5 sysBlue"></i><span class="btn-txt">修改密码</span></el-button>
          <el-button type="text" size="small" @click="dialogShow('del', scope.row.id)" style="width:60px"><i class="iconfont icon-delete mgr5 sysRed"></i><span class="btn-txt">删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改密码、删除弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="10%"
      width="30%">
      <div v-if="type == 'edit'" class="clearfix posR">
        <div class="floatL password">新密码：</div>
        <el-input class="floatL" placeholder="请输入新密码" v-model.trim="psw" type="password"></el-input>
      </div>
      <span v-else>删除后此后台账户无法恢复</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="btnLoading" v-if="type == 'edit'" type="primary" @click="editPsw">确 定</el-button>
        <el-button :loading="btnLoading" v-else type="primary" @click="del">确定删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {operationUserList, operationUserPsw, deleteOperationUser} from '@/api/setting.js'
import md5 from 'js-md5';
export default {
  name: 'adminAccountIndex',
  data() {
    return {
      btnLoading: false,
      tableData:[{userName: '111', name: '2222'}],
      dialogTitle: '',
      dialogVisible: false,
      loading: false,
      type: '', // 弹窗类型
      psw: '',
      id: ''
    }
  },
  methods: {
    getoperationUserList () {
      this.loading = true
      operationUserList().then(res => {
        console.log(res, '用户设置列表')
        this.tableData = res.data
        this.tableData.map(i => {
          i.authority = '超级管理员'
        })
        this.loading = false
      })
    },
    editPsw () {
      let reg = /[\u4E00-\u9FA5]/
      if (reg.test(this.psw)) return this.$message.error('密码不能存在中文！')
      this.btnLoading = true
      let params = {
        id: this.id,
        psw: md5(this.psw)
      }
      operationUserPsw(params).then(res => {
        this.btnLoading = false
        this.$message.success(res.msg)
        this.getoperationUserList()
        this.dialogVisible = false
      })
    },
    del () {
      this.btnLoading = true
      deleteOperationUser({id: this.id}).then(res => {
        this.btnLoading = false
        this.$message.success(res.msg)
        this.getoperationUserList()
        this.dialogVisible = false
      })
    },
    dialogShow(type, id) {
      if (type == 'edit') {
        this.dialogTitle = '修改密码'
        this.psw =''
        this.type = type
      } else {
        this.dialogTitle = '确定删除此后台账户？'
        this.type = type
      }
      this.id = id
      this.dialogVisible = true
    }
  },
  created () {
    this.getoperationUserList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.admin-account-index{
  margin-top:16px;
  .floatL{
    float:left;
    text-align:left !important;
  }
  .password{
    height:36px;
    line-height:36px;
  }
  .el-input{
    width:80%;
  }
}
</style>
