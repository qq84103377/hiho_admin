<template>
  <!--新增邀请码-->
  <el-dialog
    title="生成邀请码"
    :visible.sync="popShow"
    width="30%">
    <div class="code">{{code}}</div>
    <div class="label-group pop-code">用户等级:
      <el-select v-model="level" placeholder="请选择">
        <el-option
          v-for="item in options.level"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="label-group pop-code">所属用户:
      <el-select
        v-model.trim="user"
        filterable
        allow-create
        default-first-option
        placeholder="请选择所属用户">
        <el-option
          v-for="item in options.user"
          :key="item.id"
          :label="item.name+' ('+ item.phone +')'"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="popShow = false" size="medium">取 消</el-button>
    <el-button :loading="btnLoading" type="primary" size="medium" @click="createCode">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import {addInviteCode, judgeInviteCode, getVipList, getUserList} from '@/api/user.js'

  export default {
    name: "create-code-pop",
    data() {
      return {
        btnLoading: false,
        code: '',
        level: '',
        user: '',
        options: {
          level: [],
          user: []
        },
        popShow: false
      }
    },
    methods: {
      createCode() {
        if (!this.level) {
          this.$message.error('请选择用户等级')
        } else if (!this.user) {
          this.$message.error('请选择所属用户')
        } else {
          this.btnLoading = true
          let params = {
            code: this.code,
            vipLevelId: this.level,
            ownerUserId: this.user
          }
          addInviteCode(params).then(res => {
            this.btnLoading = false
            this.$emit('close')
          })
          this.popShow = false
        }
      },
      codePopShow() {
        this.level = ''
        this.user = ''
        this.code = Math.random().toString(36).substr(2, 6).toLocaleUpperCase();
        let params = {code: this.code}
        judgeInviteCode(params).then(res => {
          if (res.code == 1) {
            this.code = Math.random().toString(36).substr(2, 6).toLocaleUpperCase();
            return this.codePopShow()
          } else {
            let params1 = {onlyVipFlag: 1}
            getVipList(params1).then(res => {
              this.options.level = res.data
            })
            getUserList({}).then(res => {
              this.options.user = res.data.users.filter(v => {
                return v.vipLevel != '游客'
              })
            })
            this.popShow = true
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .code {
    background: $lightBg;
    font-size: 16px;
    color: $sysBlack;
    line-height: 40px;
  }

  .label-group.pop-code {
    font-size: 14px;
    width: 280px;
    margin: 16px auto 0;
    line-height: 28px;
  }
</style>
