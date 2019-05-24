<template>
  <div class="return-address-index">
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="receiverName"
        width="150"
        label="收货人">
      </el-table-column>
      <el-table-column
        prop="phone"
        width="150"
        label="联系电话">
      </el-table-column>
      <el-table-column
        label="详细地址">
        <template slot-scope="scope">
          <span>{{`${scope.row.province}${scope.row.area}${scope.row.address}`}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dialogShow(scope.row)" style="width:60px"><i class="iconfont icon-edit sysBlue mgr5"></i><span class="btn-txt">修改信息</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--修改退货地址侧边栏-->
    <transition name="right-move">
      <div class="add-brand-pop" v-if="editShow">
        <div class="pop-head">
          <div class="title">修改退货地址</div>
          <div class="btn-group">
            <el-button size="medium" @click="editShow = false">取消</el-button>
            <el-button :loading="btnLoading" size="medium" type="primary" @click="editSave('editForm')">确定</el-button>
          </div>
        </div>
        <el-form :model="editForm" :rules="rules" ref="editForm" :inline="true" label-width="100px" class="demo-ruleForm">
          <el-form-item label="收货人" prop="receiverName">
            <el-input v-model.trim="editForm.receiverName" placeholder="请输入收货人名称"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model.trim="editForm.phone" placeholder="请输入电话号码"></el-input>
          </el-form-item>
          <el-form-item label="所在地区" prop="areas" class="area">
            <area-cascader v-model.trim="editForm.areas" :level="1" :data="pcaa" type="text"></area-cascader>
          </el-form-item>
          <el-row>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="editForm.address" placeholder="请输入收货的详细地址" style="width:594px; max-width:594px;"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </transition>
    <transition name="opcity">
      <div class="cover" v-if="editShow" @click="editShow = false">
      </div>
    </transition>
  </div>
</template>

<script>
import {operationAddressList, updateOperationAddress} from '@/api/setting.js'
import { pca, pcaa } from 'area-data' // v5 or higher
// import {AreaCascader, AreaSelect } from 'vue-area-linkage'
export default {
  name: 'returnAddressIndex',
  // components: {
  //   AreaCascader,
  //   AreaSelect
  // },
  data() {
    return {
      btnLoading: false,
      rules: {
        receiverName: [
          { required: true, message: '收货人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
        ],
        areas: [
          { required: true, message: '所在地区不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ]
      },
      pcaa: [],
      tableData:[],
      editShow: false,
      loading: false,
      editForm: {
        receiverName:'',
        phone:'',
        province:'',
        areas: [],
        city:'',
        area:'',
        address:''
      },
    }
  },
  methods: {
    getOperationAddressList () {
      this.loading = true
      operationAddressList().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    dialogShow(row) {
      this.dialogTitle = '修改退货地址'
      this.editForm = {
        id: row.id,
        receiverName: row.receiverName,
        phone: row.phone,
        province: row.province,
        city: row.city,
        area: row.area,
        address: row.address,
        areas: [row.province,row.city, row.area]
      }
      this.pcaa = pcaa
      this.editShow = true
    },
    editSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
          if(!reg.test(this.editForm.phone)) return this.$message.error('请输入正确的电话号码')
          this.btnLoading = true
          this.editForm.province = this.editForm.areas[0]
          this.editForm.city = this.editForm.areas[1]
          this.editForm.area = this.editForm.areas[2]
          this.editForm.areas = undefined
          updateOperationAddress(this.editForm).then(res =>{
            this.btnLoading = false
            this.$message.success(res.msg)
            this.getOperationAddressList()
            this.editShow = false
          })
        } else {
          return this.$message.error('请输入相关内容')
        }
      })
    }
  },
  created () {
    this.getOperationAddressList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.return-address-index{
  // 重写选择地区样式
  .area-select{
    height:40px !important;
    width: 594px;
  }
  .area-select .area-selected-trigger{
    height:36px !important;
    line-height:36px !important;
    padding:0 15px;
  }
  .cascader-menu-list .cascader-menu-option.hover, .cascader-menu-list .cascader-menu-option:hover{
    background-color:#f5f7fa !important;
  }
  .cascader-menu-list .cascader-menu-option.selected{
    color:#409EFF;
    font-weight:700;
    background-color:#fff;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
 @import 'src/styles/variables.scss';
.return-address-index{
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
    width:240px;
  }
  .el-select{
    width:240px;
  }
  .btn-txt{
    color:$auxiliaryText;
    &:hover{
      color:$sysBlack
    }
  }
  .right-move-enter-active,
  .right-move-leave-active {
    transition: all 0.3s ease;
    transform: translateX(0);
  }

  .right-move-enter,
  .right-move-leave-to {
    transform: translateX(100%);
  }

  .opcity-enter-active,
  .opcity-leave-active {
    transition: all 0.5s ease;
    opacity: 0.5;
  }
  .opcity-enter,
  .opcity-leave-to {
    opacity: 0;
  }
.cover {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .add-brand-pop {
    height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    width: 750px;
    background: #fff;
    z-index: 101;
    color: $sysBlack;
    .pop-head {
      padding: 32px 32px 37px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // border-bottom: 1px solid #E8E8E8;
      .title {
        font-size: 24px;
      }
    }
    .pop-main {
      padding: 24px 32px;
      .label-group {
        margin-bottom: 16px;
        width: 100%;
        display: flex;
        .label-title {
          width: 80px;
          margin-right: 10px;
          text-align: right;
          display: inline-block;
        }
      }
    }
  }
}
</style>

