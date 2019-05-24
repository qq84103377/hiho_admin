<template>
  <el-dialog title="发货" :visible.sync="dialogVisible" width="480px" @close="$emit('update:visible', false)" top="20%">
    <el-form :model="form" ref="form" :rules="rules" style="width: 380px" class="deliver-form">
      <el-form-item prop="logisticsCompany" label="物流公司" :label-width="formLabelWidth">
        <el-autocomplete
          style="width: 100%"
          v-model="form.logisticsCompany"
          :fetch-suggestions="querySearch"
          placeholder="请输入物流公司"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item prop="logisticsNum" label="物流单号" :label-width="formLabelWidth">
        <el-input v-model="form.logisticsNum" auto-complete="off" placeholder="请输入物流单号"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native.prevent="resetForm">取 消</el-button>
      <el-button type="primary" @click.native.prevent = "submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deliveryGoods, getCompaniesH5} from '@/api/order'
export default {
  name: 'deliverGoodsDialog',
  props: ['orderId', 'visible', 'formDate'],
  data() {
    return {
      form: {
        logisticsCompany: '',
        logisticsNum: ''
      },
      rules: {
        logisticsCompany: [
          { required: true, message: '请选择或输入物流公司' }
        ],
        logisticsNum: [
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
      dialogVisible: false,
      logisticsList: []
    }
  },
  computed: {
  },
  methods: {
    querySearch(queryString, cb) {
      // var restaurants = [
      //   { value: '顺丰速运' },
      //   { value: 'EMS' },
      //   { value: '申通快递' },
      //   { value: '圆通快递' },
      //   { value: '中通快递' },
      //   { value: '韵达快递' },   
      //   { value: '宅急送快递' },
      //   { value: '百世汇通快递' },
      //   { value: '天天快递' },
      //   { value: '德邦物流' },
      //   { value: '全峰快递' }]
      var results = queryString ? this.logisticsList.filter(this.createFilter(queryString)) : this.logisticsList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    getCompaniesH5 () {
      getCompaniesH5().then(res => {
        this.logisticsList = res.data ? res.data.map(i => {
          return {value: i.companyName}
        }) : []
      })
    },
    submitForm(formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            orderId: this.orderId,
            ...this.form
          }
          deliveryGoods(params).then(res => {
            if (res.code === 0) {
              this.$emit('update:visible', false)
              this.$emit('deliverSuccess')
              this.$refs.form.resetFields()
            }
          })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      console.log(formName)
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    }

  },
  watch: {
    visible() {
      this.dialogVisible = this.visible
    },
    formDate (){
      this.form = this.formDate
      console.log(this.form, 'form')
    }
  },
  created() {
    this.getCompaniesH5()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
 @import 'src/styles/variables.scss';
// .deliver-form{
  .el-popper[x-placement^=bottom]{
    margin-top:23px;
  }
// }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
 @import 'src/styles/variables.scss';

</style>
