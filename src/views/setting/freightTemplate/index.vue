<template>
  <div class="freight-template-index">
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="运费模板名称">
      </el-table-column>
      <el-table-column
        prop="brands"
        label="应用品牌">
        <!--<template slot-scope="scope">-->
          <!--<el-popover-->
            <!--placement="top-start"-->
            <!--title="标题"-->
            <!--width="200"-->
            <!--trigger="hover"-->
            <!--content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">-->
            <!--<span slot="reference">{{scope.row.brands}}</span>-->
          <!--</el-popover>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        prop="remark"
        label="规则">
      </el-table-column>
      <el-table-column
        label="操作"
        width="174">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)" style="width:60px"><i
            class="iconfont icon-edit sysBlue mgr5"></i><span class="btn-txt">修改模板</span></el-button>
          <el-button type="text" size="small" @click="dialogDel=true;id=scope.row.id" style="width:60px"><i
            class="iconfont icon-delete sysBlue mgr5"></i><span class="btn-txt">删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-col class="page-content">
    <el-pagination
    background
    @current-change="handleCurrentChange"
    :page-size="10"
    layout="prev, pager, next" :total="totalCount">
    </el-pagination>
    </el-col>

    <!-- 新增/修改 -->
    <el-dialog
      :title="`${id?'修改':'新增'}运费模板`"
      :visible.sync="dialogVisible"
      top="10%"
      width="30%">
      <div>
        <div class="clearfix" style="margin-bottom: 16px;">
          <div class="floatL password">名称：</div>
          <el-input :maxlength="30" class="floatL" placeholder="请输入模板名称" v-model.trim="templateName"></el-input>
        </div>
        <div class="clearfix">
          <div class="floatL password">运费：</div>
          <el-input @input="handlerInput" type="number" class="floatL" :placeholder="`${num}`" v-model="freight"><i
            slot="prefix" class="icon">￥</i>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="editSave">确定</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title="确定删除当前运费模板吗?"
      :visible.sync="dialogDel"
      top="10%"
      width="30%">
      <div>
        删除后此模板无法恢复
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="del">确定删除</el-button>
      </span>
    </el-dialog>
    <!-- 无法删除 -->
    <el-dialog
      title="当前运费模板已被品牌应用,不可删除"
      :visible.sync="dialogDisable"
      top="10%"
      width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDisable=false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getFreights, saveFreightTemplete, deleteFreightTemplete } from '@/api/setting.js'

  export default {
    name: 'freightTemplateIndex',
    data() {
      return {
        templateName: '',
        tableData: [],
        btnLoading: false,
        dialogVisible: false,
        dialogDisable: false,
        dialogDel: false,
        loading: false,
        id: '',
        freight: '',
        num: '',
        totalCount: 0
      }
    },
    methods: {
      del(){
        this.btnLoading = true
        deleteFreightTemplete({id:this.id}).then(res => {
          this.btnLoading = false
          if(res.code==0){
            this.$message.success('删除成功')
            this.dialogDel = false
            this.getFreightTempleteList()
          }else {
            this.$message.error(res.msg)
          }
        })
      },
      // 分页
      handleCurrentChange(e) {
        this.getFreightTempleteList(e)
      },
      addTemplate() {
        this.id = ''
        this.templateName = ''
        this.freight = ''
        this.num = ''
        this.dialogVisible = true
      },
      handlerInput() {
        this.freight = this.freight.toString().replace(/-/g, '')
      },
      edit(row) {
        this.id = row.id
        this.templateName = row.name
        this.num = row.remark.split("¥")[1]
        this.freight = this.num
        this.dialogVisible = true
      },
      editSave() {
        let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
        if (this.templateName==='') return this.$message.error('模板名称不能为空')
        if (!reg.test(this.freight)) return this.$message.error('运费不能超过小数点后两位或为空')
        this.btnLoading = true
        let params = {
          id: this.id,
          name: this.templateName,
          freight: this.freight * 1
        }
        saveFreightTemplete(params).then(res => {
          this.btnLoading = false
          if(res.code==0){
            this.$message.success(this.id?'编辑成功':'新增成功')
            this.getFreightTempleteList()
            this.dialogVisible = false
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      getFreightTempleteList(e) {
        this.loading = true
        getFreights({ pageNum: e || 1, pageSize: '10' }).then(res => {
          this.totalCount = res.data.totalCount
          this.tableData = res.data.freightTempleteOneResponses
          this.loading = false
        })
      }
    },
    created() {
      this.getFreightTempleteList()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .freight-template-index {
    .el-input--prefix .el-input__inner {
      padding-left: 18px !important;
    }
  }

</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .freight-template-index {
    margin-top: 16px;
    .floatL {
      float: left;
      text-align: left !important;
    }
    .password {
      height: 36px;
      line-height: 36px;
    }
    .el-input {
      width: 80%;
    }

    .icon {
      font-style: normal !important;
      line-height: 36px;
      text-align: right;
    }
  }
</style>
