<template>
  <div class="activity-edit">
    <content-wrap :title="title">
      <div slot="btn">
        <el-button size="medium" @click="$router.go(-1)">取消</el-button>
        <el-button :loading="btnLoading" type="primary" size="medium" @click="submitForm">{{btnTitle}}</el-button>
      </div>
    </content-wrap>
    <div class="addForm">
      <div class="formTitle">活动信息</div>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="form demo-form-inline"
               :inline="true">
        <el-row>
          <el-form-item label="品牌：" prop="brandId" class="width232">
            <el-select v-model.trim="addForm.brandId" placeholder="请选择品牌" clearable filterable @change="changeGoodsList">
              <el-option
                v-for="item in brandList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称：" prop="name" class="width232">
            <el-input v-model.trim="addForm.name" placeholder="请输入活动名称"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开始时间：" prop="startDate" class="width232">
            <el-date-picker
              v-model="addForm.startDate"
              type="datetime"
              value-format="timestamp"
              placeholder="请选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endDate" class="width232">
            <el-date-picker
              v-model="addForm.endDate"
              type="datetime"
              value-format="timestamp"
              placeholder="请选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="活动介绍：" prop="remark" class="width232">
            <el-input v-model.trim="addForm.remark" type="textarea" placeholder="请输入品牌活动信息"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <div class="label-group spec-info clearfix">
            <span class="label-title"><i>*</i>商品图片：</span>
            <div style="float: left;width: 800px;">
              <pic-list :text="activityTxt" @updateImg="updateImg" :fileList="addForm.pictures">
                <upload-btn v-if="addForm.pictures.length < 9" slot="upload" @uploadImg="uploadGoodsImg" id="1"></upload-btn>
              </pic-list>
            </div>
          </div>
        </el-row>
        <el-row>
          <el-form-item label="合成图片：" class="width232">
            <pic-list :text="text1" @delImg="uploadImg" :isCover="false" :fileList="imgList">
              <upload-btn slot="upload" :multiple="false" @uploadImg="uploadImg" id="2"></upload-btn>
            </pic-list>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="good-list addForm">
      <div class="formTitle">活动商品</div>
      <el-button class="checkBtn" @click="addGood">选择商品</el-button>
      <el-row style="padding:0 32px 32px;" v-if="selectDoods.length > 0">
        <el-table
          :data="selectDoods"
          style="width:100%;"
          border
          v-loading="selectLoading"
        >
          <template v-for="e in clos">
            <el-table-column
              :prop="e.prop"
              :label="e.label"
              :sortable="e.sortable"
              :width="e.width || ''"
              :key="e.label" v-if="e.prop === 'name'">
              <template slot-scope="scope">
                <div style="display: flex;">
                  <img style="width: 40px;height: 40px;margin-right: 12px;" :src="scope.row.picPath" alt="商品图片">
                  <div>
                    <div>{{scope.row.styleNo}}</div>
                    <div style="color: #9898A1">{{scope.row.name}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :prop="e.prop"
              :label="e.label"
              :sortable="e.sortable"
              :width="e.width || ''"
              :key="e.label">
            </el-table-column>
          </template>
          <el-table-column
            v-if="$route.query.id"
            prop="saleSum"
            label="累计销量"
            sortable="true"
            width="105"
            key="saleSum">
          </el-table-column>
          <el-table-column
            prop="activity"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="mgr5" @click="stockEdit(scope.row)"><i class="iconfont icon-edit mgr5 sysBlue"></i><span class="fs14 sysBlack">修改在售库存</span></el-button>
              <el-button type="text" size="small" @click="del(scope.row.id)"><i class="iconfont icon-delete sysRed mgr5"></i><span class="fs14 sysBlack">删除</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- 选择商品 -->
    <el-dialog
      title="选择商品"
      :visible.sync="chooseGood"
      width="750px"
      top="10%"
    >
      <div class="mgb20 clearfix">
        <span>品牌：{{brandMap[addForm.brandId]}}</span>
        <el-input
          placeholder="输入商品款号或名称搜索"
          prefix-icon="el-icon-search"
          class="floatR width750"
          @input="changeSearch"
          v-model="keyword">
        </el-input>
      </div>
      <el-row>
        <el-table
          :data="goodData"
          style="width:100%"
          border
          max-height="450"
          ref="tableDataOne"
          @row-click="tableDataOneRowClick"
          v-loading="chooseGoodLoading"
          @selection-change="selectRowData"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <template v-for="e in goodClos">
            <el-table-column
              :prop="e.prop"
              :label="e.label"
              :sortable="e.sortable"
              :width="e.width || ''"
              :key="e.label" v-if="e.prop === 'name'">
              <template slot-scope="scope">
                <div style="display: flex;">
                  <img style="width: 40px;height: 40px;margin-right: 12px;" :src="scope.row.picPath" alt="商品图片">
                  <div>
                    <div>{{scope.row.styleNo}}</div>
                    <div style="color: #9898A1">{{scope.row.name}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :prop="e.prop"
              :label="e.label"
              :sortable="e.sortable"
              :width="e.width || ''"
              :key="e.label">
            </el-table-column>
          </template>
        </el-table>
      </el-row>
      <span slot="footer" class="dialog-footer">
		    <el-button @click="chooseGood = false">取 消</el-button>
		    <el-button type="primary" @click="addSubmit">确 定</el-button>
		  </span>
    </el-dialog>
    <!-- 修改在售库存 -->
    <el-dialog
      title="修改在售库存"
      :visible.sync="editShow"
      width="528px">
      <el-row>
        <el-table
          :data=" stockData"
          style="width:100%;position:relative"
          border
        >
          <el-table-column
            prop="name"
            label="规格">
          </el-table-column>
          <el-table-column
            prop="stock"
            label="在售库存">
            <template slot-scope="scope">
              <!-- <span v-if="!edit">{{scope.row.stock}}</span> -->
              <el-input v-model.trim="scope.row.stock"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-input class="posA place" @input="batchEdit" placeholder="批量输入" v-model="text"></el-input>
        <!-- <span class="posA place" @click="edit = true">批量输入</span> -->
      </el-row>
      <span slot="footer" class="dialog-footer">
		    <el-button @click="editShow = false, edit = false">取 消</el-button>
		    <el-button type="primary" @click="saveStock">确 定</el-button>
		  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {listGoods, editStockPage, editStock} from '@/api/goods.js'
  import {addActivity, updateActivity, activityDetail, goodsOfActivity, removeGoods} from '@/api/activity.js'
  export default {
    name: 'activityEdit',
    data() {
      return {
        btnLoading: false,
        title: '',
        btnTitle: '',
        showEdit: false,
        rules: {
          brandId: [
            {required: true, message: '品牌不可为空', trigger: 'change'}
          ],
          name: [
            {required: true, message: '活动名称不可为空', trigger: 'blur'}
          ],
          startDate: [
            {required: true, message: '开始时间不可为空', trigger: 'change'}
          ],
          endDate: [
            {required: true, message: '结束时间不可为空', trigger: 'change'}
          ],
          pictures: [
            {required: true, message: '商品图片不可以为空', trigger: 'change'}
          ],
        },
        addForm: {
          name: '',
          brandId: '',
          remark: '',
          startDate: '',
          endDate: '',
          pictures: [],
          remixPicture: '',
          goodsIds: []
        },
        brandList: [
          {label: '111', value: 1}
        ],
        uploadParams: {},
        dialogVisible: false,
        dialogImageUrl: '',
        clos: [
          {label: '商品', prop: 'name', sortable: false},
          {label: '销售价', prop: 'salePrice', sortable: false, width: '100'},
          {label: '销售代购价', prop: 'purchaseCost', sortable: false, width: '100'},
          {label: '商品规格', prop: 'specs', sortable: false, width: '100'},
          {label: '剩余库存', prop: 'stock', sortable: true, width: '105'}
        ],
        goodClos: [
          {label: '商品', prop: 'name', sortable: false},
          {label: '销售价', prop: 'salePrice', sortable: false, width: '100'},
          {label: '标准代购价', prop: 'purchaseCost', sortable: false, width: '100'},
          {label: '商品规格', prop: 'specs', sortable: false, width: '100'},
          {label: '剩余库存', prop: 'stock', sortable: true, width: '105'}
        ],
        selectDoods: [],
        goodData: [], // 商品列表
        chooseGoodLoading: false,
        selectLoading: false,
        keyword: '',
        brandMap: {},
        stockData: [], // 库存列表
        chooseGood: false, // 选择商品
        editShow: false, // 修改
        edit: false, // 修改编辑
        searchName: '',
        imgList: [],
        Rrow: '',
        text: '',
        selectData: [],
        delIds: [],
        activityTxt: '最多上传9张图片，支持 1M 以内JPG、PNG格式的图片，建议图片尺寸为 800x800。拖动可排序。',
        text1: '用于用户转发时的合成图片'
      }
    },
    components: {
    },
    methods: {
      batchEdit() {
        for (let i = 0; i < this.stockData.length; i++) {
          this.stockData[i].stock = this.text
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      addGood() {
        if (this.addForm.brandId == '') {
          return this.$message.error('请选择品牌')
        }
        if (this.$route.query.id) {
          this.getListGood()
        }
        this.chooseGood = true
      },
      updateImg (v) {
        this.addForm.pictures = v
      },
      uploadGoodsImg(v) {
        this.addForm.pictures = this.addForm.pictures.concat(v)
        console.log(this.addForm.pictures, '活动图片');
      },
      uploadImg(v) {
        this.addForm.remixPicture = v.length ? v[0] : ''
        this.imgList = v.length ? [this.addForm.remixPicture] : []
        console.log(this.imgList, '合成图片');
      },
      // 选择商品
      changeGoodsList () {
        this.getListGood()
        this.selectDoods = []
      },
      changeSearch () {
        this.getListGood()
      },
      // 点击行事件
      tableDataOneRowClick (row, event, column) {
        // for (let i = 0; i < this.selectDoods.length; i++) {
        //   if (this.selectDoods[i].id === row.id) return false
        // }
        // this.$refs.tableDataOne.clearSelection()
        // // 勾选事件
        // this.$refs.tableDataOne.toggleRowSelection(row)
        this.$refs.tableDataOne.toggleRowSelection(row)
      },
      selectRowData (selection) {
        this.selectData = selection
      },
      addSubmit () {
        this.selectLoading = true
        let arr = this.selectDoods.concat(this.selectData)
        let hash = {}
        this.selectDoods = arr.reduce((item, next) => {
            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
            return item
        }, []);
        console.log(this.selectDoods)
        this.chooseGood = false
        this.selectLoading = false
      },
      // 删除选择商品
      del(id) {
        this.selectLoading = true
        this.selectDoods.forEach((i,k) => {
          if (id === i.id) {
            this.selectDoods.splice(k, 1)
          }
        })
        this.$route.query.id ?  this.delIds.push(id) : this.$refs.tableDataOne.clearSelection()
        this.selectLoading = false
      },
      // 移除商品
      delGoods () {
        if (this.delIds&&this.delIds.length > 0) {
          let params = {activityId: this.$route.query.id, goodsIds: [...new Set(this.delIds)]}
          removeGoods(params).then(res => {})
        }
      },
      //获取商品列表
      getListGood () {
        let params = {
          keyword: this.keyword,
          brandFilter: this.addForm.brandId,
          stockFilter: '',
          statusFilter: '0',
          pageNum: 0,
          pageSize: 0,
          startCreateTimeFilter: '',
          endCreateTimeFilter: ''
        }
        this.chooseGoodLoading = true
        listGoods(params).then(res => {
          console.log(res, '商品列表')
          this.goodData = res.data.goods
          this.chooseGoodLoading = false
        })
      },
      // 修改库存
      stockEdit (row) {
        this.text = ''
        this.editShow = true
        this.getStock(row.id)
        this.Rrow = row
      },
      getStock(id) {
        this.stockLoading = true
        editStockPage({goodsId: id}).then(res => {
          this.stockData = res.data.goodsSpecSimpleParamList
          this.stockLoading = false
        })
      },
      async saveStock () {
       let params = {
          goodsSpecSimpleParamList: this.stockData,
          userId: this.$store.getters.userInfo.userId
        }
        await editStock(params).then(res => {
          this.getListGood()
          let sum = 0
          this.stockData.forEach(i => {
            sum += Number(i.stock)
          })
          this.Rrow.stock = sum
        })
        this.editShow = false
      },
      submitForm () {
        if (this.addForm.brandId == '') {
          return this.$message.error('品牌不可为空')
        } else if (this.addForm.name == '') {
          return this.$message.error('活动名称不可为空')
        } else if (this.addForm.startDate == '' || this.addForm.startDate == null) {
          return this.$message.error('开始时间不可为空')
        } else if (this.addForm.endDate == '' || this.addForm.endDate == null) {
          return this.$message.error('结束时间不可为空')
        } else if (this.addForm.pictures.length == 0) {
          return this.$message.error('商品图片不可以为空')
        } else if (this.addForm.startDate > this.addForm.endDate) {
          return this.$message.error('结束时间不能少于开始时间')
        } else if (this.selectDoods.length == 0) {
          return this.$message.error('活动商品不能为空')
        }
        this.btnLoading = true
        this.selectDoods.map(i => {
          this.addForm.goodsIds.push(i.id)
        })
        if (this.$route.query.id) {
          this.delGoods()
          updateActivity(this.addForm).then(res => {
            this.btnLoading = false
            if(res.code==0){
              this.$message.success(res.msg)
              this.$router.go(-1)
            }else {
              this.$message.error(res.msg)
            }
          })
        } else {
          addActivity(this.addForm).then(res => {
            this.btnLoading = false
            if(res.code==0){
              this.$message.success(res.msg)
              this.$router.go(-1)
            }else {
              this.$message.error(res.msg)
            }
          })
        }
      },
      // 编辑
      async getGoodsOfActivity () {
        let params = {
          id: this.$route.query.id,
          sortBy: 'stock',
          sortType: '1',
          pageNum: 1,
          pageSize: 100
        }
        await goodsOfActivity(params).then(res => {
          this.selectDoods = res.data.goods
        })
      },
      async getActivityDetail () {
        let params = {
          id: this.$route.query.id
        }
        await activityDetail(params).then(res => {
          this.addForm = {
            id: res.data.id,
            name: res.data.name,
            brandId: res.data.brandId,
            remark: res.data.remark,
            startDate: new Date(res.data.startTime).getTime(),
            endDate: new Date(res.data.endTime).getTime(),
            pictures: res.data.activityPictures || [],
            remixPicture: res.data.remixPicture,
            goodsIds: []
          }
          this.imgList = this.addForm.remixPicture !== ''? [this.addForm.remixPicture] : []
        })
      }
    },
    created () {
      let list= JSON.parse(sessionStorage.getItem('brandList'))
      this.brandList = list.map(i => {
        this.brandMap[i.id] = i.name
        return {value: i.id, label: i.name}
      })
      if (this.$route.query.id) {
        this.title = '编辑活动'
        this.btnTitle = '确定'
        this.getGoodsOfActivity()
        this.getActivityDetail()
      } else {
        this.title = '新建活动'
        this.btnTitle = '新建'
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import 'src/styles/variables.scss';
  .el-form-item__label {
    color: $sysBlack !important;
    font-size: 14px !important;
    font-weight: 400 !important;
  }

  .el-textarea__inner {
    height: 120px !important;
    width: 579px !important;
  }

  .el-dialog__body {
    text-align: left;
  }

  .el-dialog__footer {
    text-align: right;
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .activity-edit {
    .ml16 {
      margin-left: 16px;
    }
    .floatR {
      float: right;
    }
    .width750 {
      width: 750px;
    }
    .addForm {
      background: #fff;
      border: 1px solid $divideBorder;
      .formTitle {
        padding: 18px 0 18px 32px;
        font-size: 18px;
        border-bottom: 1px solid $divideBorder;
      }
      .form {
        margin: 24px;
        .width232 {
          .el-input {
            width: 232px !important;
          }
          .el-select{
          	width:232px !important;
          }
        }
        .text-color {
          color: $auxiliaryText;
        }
      }
    }
    .good-list {
      margin-top: 16px;
      background: #fff;
      border: 1px solid $divideBorder;
      .checkBtn {
        margin: 16px 0 32px 32px;
        width: 88px;
        height: 36px;
        color: $sysGolden !important;
        background: linear-gradient(90deg, rgba(69, 69, 64, 1), rgba(35, 35, 33, 1)) !important;
        border: none;
        padding: 8px 16px;
      }
      .tableText {
        cursor: pointer;
        .iocn-color {
          color: red;
          display: inline-block;
          margin-right: 5px;
        }
      }
    }
    .good {
      .goodImg {
        width: 40px;
        height: 40px;
        float: left;
      }
      .goodTxt {
        float: left;
        height: 40px;
        .txtcolor1 {
          color: $sysBlack;
        }
        .txtcolor2 {
          color: $divideBorder;
        }
      }
      .goodTitle {
        float: left;
      }
    }
    .place {
      width:100px !important;
      height:36px !important;
      top: 6px;
      right: 60px;
      /* margin-left: 8px; */
      border: 1px solid $divideBorder !important;
      color: $placeholderText;
      background: #fff;
      cursor: pointer;
      .el-input__inner{
        border:none !important;
      }
    }
    // 封面样式重写
    .label-group {
      margin-top: 16px;
      .desc {
        font-size: 14px;
        float: left;
      }
      .label-title {
        width: 100px;
        padding:0 12px 0 0;
        float: left;
        font-size: 14px;
        text-align: right;
      }
    }
    .spec-info {
        .add-spec {
          color: $functionText;
          padding: 8px 16px;
          font-size: 14px;
          border: 1px solid #ebeef5;
          border-top: none;
          cursor: pointer;
        }
        .add_photo {
          /*display: block;*/
          input {
            opacity: 0;
            position: absolute;
            width: 60px;
            z-index: -999999;
          }
          .upload-file {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            width: 100px;
            height: 100px;
            border: 1px dashed $inputBorder;
          }
        }
        i {
          font-style: normal;
          line-height: 16px;
          color: $sysRed;
        }
        .batch-edit {
          position: absolute;
          left: 316px;
          top: 13px;
          width: 72px;
          height: 24px;
          font-size: 10px;
          .el-input__inner {
            height: 24px;
          }
        }
      }
  }
</style>
