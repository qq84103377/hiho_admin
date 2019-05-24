<template>
  <section class="user-guide">
    <div v-loading="loading" v-for="(item,index) in guideList" :key="index" class="desc-item">
      <div class="desc-item__title">
        <span>{{item.name}} <i
          @click="cateName=item.name;editInfo.guideAssortId=item.guideAssortId;visible.addCate = true"
          class="iconfont icon-edit pointer"
          style="margin-right: 25px;"></i></span>
        <span>数量:{{item.amount}}</span>
      </div>
      <div class="desc-item__content">
        <el-table
          v-loading="loading"
          :data="item.guideOneResponses"
          border
          style="width: 100%">
          <el-table-column
            prop="title"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="answer"
            label="答案">
            <template slot-scope="scope">
              <!--<div>{{transferText(scope.row)}}</div>-->
              <div class="rich-text" v-transfer v-html="scope.row.answer"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="174">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editTemp(scope,item)" style="width:60px"><i
                class="iconfont icon-edit sysBlue mgr5"></i><span class="btn-txt">修改模板</span></el-button>
              <el-button type="text" size="small" @click="editInfo.guideId=scope.row.guideId;visible.del = true"
                         style="width:60px"><i
                class="iconfont icon-delete sysBlue mgr5"></i><span class="btn-txt">删除</span></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="desc-item__add"><span
          @click="editInfo={title: '',answer: '',guideId: '',guideAssortId: item.guideAssortId};popShow=true"
          class="iconfont icon-Btn-add fs14 pointer"> 新增说明</span>
        </div>
      </div>
    </div>

    <el-dialog
      :title="`${editInfo.guideAssortId?'编辑':'添加'}说明分类`"
      :visible.sync="visible.addCate"
      top="10%"
      width="30%">
      <div>
        <span>分类名称:</span>
        <el-input placeholder="请输入分类名称" v-model.trim="cateName"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible.addCate = false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="saveGuideCate">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="确定删除当前说明吗?"
      :visible.sync="visible.del"
      top="10%"
      width="30%">
      <div>
        删除后该说明将无法恢复
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible.del = false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="delGuide">确定删除</el-button>
      </span>
    </el-dialog>
    <user-guide-pop @confirm="getList" :editInfo="editInfo" :popShow.sync="popShow"></user-guide-pop>
  </section>
</template>

<script>
  import userGuidePop from '../../common/user-guide-pop'
  import {getGuides, saveGuideAssort, deleteGuide} from '@/api/setting'

  HTMLCollection.prototype.forEach = function (callback) {
    [].slice.call(this).forEach(callback)
  }

  export default {
    components: {userGuidePop},
    data() {
      return {
        editInfo: {
          title: '',
          answer: '',
          guideId: '',
          guideAssortId: ''
        },
        btnLoading: false,
        loading: false,
        popShow: false,
        cateName: '',
        visible: {
          addCate: false,
          del: false
        },
        guideList: [{}],
      }
    },
    directives: {
      transfer: {
        inserted: (el, {value}) => {
          const img = el.getElementsByTagName('img')
          if (img.length) {
            img.forEach(v => {
              v.parentNode.removeChild(v)
            })
          }
          el.innerHTML = el.innerHTML.replace(/<br>/g, '')
        },
        update: (el, {value}) => {
          const img = el.getElementsByTagName('img')
          if (img.length) {
            img.forEach(v => {
              v.parentNode.removeChild(v)
            })
          }
          el.innerHTML = el.innerHTML.replace(/<br>/g, '')
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      editTemp(scope, item) {
        this.editInfo = {...scope.row, guideAssortId: item.guideAssortId}
        this.popShow = true
      },
      delGuide() {
        this.btnLoading = true
        deleteGuide({guideId: this.editInfo.guideId}).then(res => {
          this.btnLoading = false
          if (res.code == 0) {
            this.visible.del = false
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      saveGuideCate() {
        if (this.cateName === '') return this.$message.error('分类名称不能为空')
        this.btnLoading = true
        saveGuideAssort({guideAssortId: this.editInfo.guideAssortId, name: this.cateName}).then(res => {
          this.btnLoading = false
          if (res.code == 0) {
            this.visible.addCate = false
            this.$message.success(this.editInfo.guideAssortId ? '编辑成功' : '添加成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      getList() {
        this.loading = true
        getGuides().then(res => {
          this.loading = false
          console.log(res);
          if (res.code == 0) {
            this.guideList = res.data.guideUnitResponses
          }
        })
      },
      addCate() {
        this.editInfo.guideAssortId = ''
        this.cateName = ''
        this.visible.addCate = true
      }
    }
  }
</script>

<style lang="scss">
  .user-guide {
    .rich-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      p {
        display: inline !important;
        &:after
        {
          content: ' ';
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .user-guide {
    margin-top: 16px;
    .desc-item {
      background: #fff;
      border: 1px solid $divideBorder;
      margin-bottom: 16px;
      &__title {
        font-size: 18px;
        color: $sysBlack;
        padding: 0 32px;
        line-height: 60px;
        border-bottom: 1px solid $divideBorder;
      }
      &__content {
        padding: 16px 32px 24px;
      }
      &__add {
        line-height: 36px;
        color: $functionText;
        border: 1px solid #ebeef5;
        border-top: none;
        padding-left: 10px;
      }
    }
    .rich-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      p {
        display: inline !important;
      }
    }
  }
</style>
