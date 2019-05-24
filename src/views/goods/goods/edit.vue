<template>
  <div class="goods-edit">
    <content-wrap :title="$route.query.goodsId?'编辑商品':'新建商品'">
      <div slot="btn">
        <el-button size="medium" @click="$router.go(-1)">取消</el-button>
        <el-button :loading="btnLoading" type="primary" size="medium" @click="editGoods">确定</el-button>
      </div>
      <div>
        <div class="content-head">
          <div style="display: flex;align-items: center;">商品信息</div>
        </div>
        <div class="content-main">
          <el-form :model="goodsInfo" :rules="rules" ref="goodsInfo" label-width="84px"
                   class="goods-ruleForm clearfix">
            <el-form-item label="款号" prop="styleNo">
              <el-input v-model.trim="goodsInfo.styleNo" placeholder="请输入商品款号"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model.trim="goodsInfo.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="款式" prop="style">
              <el-input v-model.trim="goodsInfo.style" placeholder="请输入商品款式"></el-input>
            </el-form-item>
            <el-form-item label="销售价" prop="salePrice">
              <el-input type="number" v-model.number="goodsInfo.salePrice" placeholder="¥"></el-input>
            </el-form-item>
            <el-form-item label="标准代购费" prop="purchaseCost">
              <el-input type="number" v-model.number="goodsInfo.purchaseCost" placeholder="¥"></el-input>
            </el-form-item>
            <el-form-item label="标价" prop="postedPrice">
              <el-input type="number" v-model.number="goodsInfo.postedPrice" placeholder="¥"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="brandId">
              <el-select :disabled="$route.query.goodsId?true:false" filterable clearable v-model="goodsInfo.brandId"
                         placeholder="请选择商品品牌">
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="运费模板" prop="freightTempleteId">-->
            <!--<el-select clearable v-model="goodsInfo.freightTempleteId" placeholder="请选择运费模板">-->
            <!--<el-option-->
            <!--v-for="item in template"-->
            <!--:key="item.freightTempleteId"-->
            <!--:label="item.freightTempleteName"-->
            <!--:value="item.freightTempleteId">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="品类" prop="categoryId">
              <el-select filterable clearable v-model="goodsInfo.categoryId" placeholder="请选择商品品类">
                <el-option
                  v-for="item in cate"
                  :key="item.categoryId"
                  :label="item.categoryName"
                  :value="item.categoryId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商款号">
              <el-input v-model.number="goodsInfo.supplierStyleNo" placeholder="请输入供应商款号"></el-input>
            </el-form-item>
            <el-form-item class="comtent-item" label="备注">
              <el-input :maxlength="30" v-model.trim="goodsInfo.comment" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-form>
          <div class="label-group spec-info clearfix">
            <span class="label-title"><i>*</i>规格信息：</span>
            <div style="float: left;width: 600px;margin-right: 24px;position: relative;">
              <!-- 表格 -->
              <div class="table-title">
                <div v-for="(item,index) in tableTitle" :key="index">
                  <span>{{item}}</span>
                </div>
              </div>
              <div>
                <draggable v-model="goodsInfo.goodsSpecParamList">
                  <div v-for="(item, index) in goodsInfo.goodsSpecParamList" :key="index" class="table-tr">
                    <div>
                      <el-input v-model.trim="item.goodsSpecName" placeholder="请输入商品规格"></el-input>
                    </div>
                    <div>
                      <el-input type="number" v-model.number="item.stock"
                                placeholder="请输入商品库存"></el-input>
                    </div>
                    <div>
                      <span class="del iconfont icon-delete mgr5" @click="delSpec(item)"> 删除</span>
                      <span class="del fs16"><i class="iconfont icon-TopBar-switch"></i>排序</span>
                    </div>
                  </div>
                </draggable>
              </div>
              <el-input class="batch-edit" @input="batchEdit" placeholder="批量输入"></el-input>
              <div class="add-spec" @click="addSpec">+ 添加规格</div>
            </div>
            <span style="float: left;font-size: 14px;color: #9898A1;">合计库存:{{totalStock}}</span>
          </div>
          <div class="label-group spec-info clearfix">
            <span class="label-title"><i>*</i>商品图片：</span>
            <div style="float: left;width: 800px;">
              <pic-list text="最少上传4张图片,最多上传9张图片,支持 1M 以内JPG、PNG格式的图片，建议图片尺寸为 800x800。拖动可排序" @updateImg="updateImg"
                        :fileList="goodsInfo.imageUrlList">
                <upload-btn v-if="goodsInfo.imageUrlList.length<9" slot="upload" @uploadImg="uploadGoodsImg"
                            id="1"></upload-btn>
              </pic-list>
              <!--<upload-btn @uploadImg="uploadGoodsImg" id="1"></upload-btn>-->
            </div>
          </div>
          <div class="label-group spec-info clearfix">
            <span class="label-title"><i>*</i>文字描述：</span>
            <div class="desc">
              <el-button @click="createDesc" size="small" style="width: 80px;margin-bottom: 8px;">一键生成</el-button>
              <el-input
                style="width: 592px;display: block;"
                type="textarea"
                :rows="6"
                placeholder="请输入商品描述"
                v-model.trim="goodsInfo.remark"
              >
              </el-input>
            </div>
          </div>
          <!-- <div class="label-group spec-info clearfix">
            <span class="label-title"><i>*</i>合成图片：</span>
            <el-button @click="createImg" size="small" style="width: 80px;margin-bottom: 8px;">一键生成</el-button>
            <div style="font-size: 14px;color: #9898A1;margin-left:84px;">自动按照特定模板生成合图（合图用于转发或批量转发）</div>
            <div style="loat: left;margin-left:84px;">
              <pic-list v-show="imgList.length > 0" :isCover="false" :isEdit="false"
                        :fileList="imgList"></pic-list>
            </div>
          </div> -->
        </div>
      </div>
    </content-wrap>
  </div>
</template>

<script>
  import {saveGoods, showGoodsPage, getSimpleList, getSimpleCategories, checkIfBound,createPuzzlePicOfGoods} from '@/api/goods.js'
  import {listBrand} from '@/api/brand.js'
  import {getPictureUploadToken} from '@/api/upload.js'
  import draggable from 'vuedraggable'

  export default {
    name: 'goodsEdit',
    data() {
      return {
        tableTitle: ['规格', '在售库存','操作'],
        brandList: [],
        rules: {
          styleNo: [
            {required: true, message: '请输入款号名称', trigger: 'blur'},
            {pattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}/, message: '请输入数字,字母,中文,长度在 2 到 16 个字符', trigger: 'blur'}
          ],
          name: [
            {pattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}/, message: '请输入数字,字母,中文,长度在 2 到 16 个字符', trigger: 'blur'}
          ],
          style: [
            {pattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}/, message: '请输入数字,字母,中文,长度在 2 到 16 个字符', trigger: 'blur'}
          ],
          salePrice: [
            {required: true, message: '请输入销售价', trigger: 'keyup'},
            {pattern: /^\d+(\.\d{1,2})?$/, message: '请输入不多于两位小数的数字', trigger: 'blur'}
          ],
          purchaseCost: [
            {pattern: /^\d+(\.\d{1,2})?$/, message: '请输入不多于两位小数的数字', trigger: 'blur'}
          ],
          postedPrice: [
            {pattern: /^\d+(\.\d{1,2})?$/, message: '请输入不多于两位小数的数字', trigger: 'blur'}
          ],
          brandId: [
            {required: true, message: '请选择品牌', trigger: 'change'},
          ],
          // freightTempleteId: [
          //   {required: true, message: '请选择运费模板', trigger: 'change'},
          // ],
          goodsSpecParamList: [
            {required: true, message: '请输入销售价', trigger: 'blur'},
            {type: 'number', message: '请输入数字', trigger: 'blur'}
          ],

        },
        imgIndex: '',
        popImgShow: false,
        mask: false,
        dialogVisible: false,
        dialogImageUrl: '',
        goodsInfo: {
          goodsId: '',
          userId: this.$store.getters.userInfo.userId,
          styleNo: '',
          name: '',
          style: '',
          salePrice: '',
          purchaseCost: '',
          postedPrice: '',
          brandId: '',
          // freightTempleteId: '',
          categoryId: '',
          imageUrlList: [],
          imageUrl: '',
          remarkPic: '',
          horizontalPic: '',
          verticalPic: '',
          goodsSpecParamList: [{goodsSpecName: '', stock: '', goodsSpecId: ''}],
          remark: '',
          supplierStyleNo: '',
          comment:''
        },
        // template: [],
        cate: [],
        imgList: [],
        btnLoading: false
        // composeImg: []
      }
    },
    created() {
      if (this.$route.query.goodsId) {
        let params = {goodsId: this.$route.query.goodsId}
        showGoodsPage(params).then(res => {
          console.log(res.data);
        this.goodsInfo = res.data
        this.brandList = [{id: this.goodsInfo.brandId, name: this.goodsInfo.brandName}]
        this.imgList = [this.goodsInfo.remarkPicUrl,this.goodsInfo.verticalPicUrl,this.goodsInfo.horizontalPicUrl]
        this.goodsInfo.remarkPic = this.goodsInfo.remarkPicUrl
        this.goodsInfo.horizontalPic = this.goodsInfo.horizontalPicUrl
        this.goodsInfo.verticalPic = this.goodsInfo.verticalPicUrl
        console.log(this.brandList);
      })
      }
      if (this.$route.query.brandId) this.goodsInfo.brandId = this.$route.query.brandId
      this.getBrandList()
      // getSimpleList().then(res => {
      //   this.template = res.data.freightTempleteList
      // })
      getSimpleCategories().then(res => {
        this.cate = res.data.categoryList
    })
    },
    methods: {
      change1 (val) {
        let reg = /^\d+(\.\d{1,2})?$/
        console.log(reg.test(val))
        if (!reg.test(val)) {
          if (val.indexOf(".")< 0 && val !="") {
            if (val.splice('.')) {
              console.log(val)
            }
          }
        }

      },
      // 一键合成图片
      // createImg () {
      //   if(!this.goodsInfo.remark) return this.$message.error('文字描述不能为空')
      //   if(this.goodsInfo.imageUrlList.length < 4) return this.$message.error('至少上传4张图片')
      //   let params = {
      //     remark: this.goodsInfo.remark,
      //     userId: this.$store.getters.userInfo.userId,
      //     pic1:this.goodsInfo.imageUrlList[0] || undefined,
      //     pic2:this.goodsInfo.imageUrlList[1] || undefined,
      //     pic3:this.goodsInfo.imageUrlList[2] || undefined,
      //     pic4:this.goodsInfo.imageUrlList[3] || undefined
      //   }
      //   const uploading = this.$loading({
      //     lock: true,
      //     text: '拼命合成中,请耐心等待',
      //     spinner: 'el-icon-loading',
      //     background: 'rgba(0, 0, 0, 0.7)'
      //   })
      //   createPuzzlePicOfGoods(params).then(res => {
      //     this.goodsInfo.remarkPic = res.data.remarkPic
      //     this.goodsInfo.horizontalPic = res.data.horizontalPic
      //     this.goodsInfo.verticalPic = res.data.verticalPic
      //     this.imgList = [this.goodsInfo.remarkPic,this.goodsInfo.verticalPic,this.goodsInfo.horizontalPic]
      //     uploading.close()
      //   }).then(res => {
      //     uploading.close()
      //   })
      // },
      createDesc() {
        let spec = ''
        let brandName = ''
        for (let i = 0; i < this.goodsInfo.goodsSpecParamList.length; i++) {
          // this.goodsInfo.goodsSpecParamList[i].goodsSpecName
          spec += this.goodsInfo.goodsSpecParamList[i].goodsSpecName + '/'
        }
        for (let i = 0; i < this.brandList.length; i++) {

          if (this.brandList[i].id === this.goodsInfo.brandId) {
            brandName = this.brandList[i].name
            break
          }
        }
        spec = spec.slice(0, spec.length - 1)
        this.goodsInfo.remark = '货号：' + this.goodsInfo.styleNo + '-' + brandName + '-' + this.goodsInfo.name +
          '\n规格：' + spec
        if (this.goodsInfo.comment) {
          this.goodsInfo.remark = this.goodsInfo.remark + '\n' + this.goodsInfo.comment
        }
        this.goodsInfo.remark = this.goodsInfo.remark +
          '\n市场价：¥' + (this.goodsInfo.postedPrice || 0).toFixed(2) +
          '\n现价：¥' + ((this.goodsInfo.salePrice||0) + (this.goodsInfo.purchaseCost||0)).toFixed(2)
        // this.goodsInfo.remark = this.goodsInfo.styleNo + '-' + this.goodsInfo.name + '\n规格：' + name + '\n款式：' + this.goodsInfo.style + '\n款号：' + this.goodsInfo.styleNo
      },
      uploadGoodsImg(v) {
        this.goodsInfo.imageUrlList = this.goodsInfo.imageUrlList.concat(v)
        console.log(this.goodsInfo.imageUrlList)
      },
      updateImg(v) {
        this.goodsInfo.imageUrlList = v
      },
      getBrandList() {
        if (this.$route.query.goodsId) return
        let params = {
          keyword: '',
          pageNum: 0,
          pageSize: 0
        }
        listBrand(params).then(res => {
          console.log(res, '品牌列表')
        this.brandList = res.data.brandOneResponseList
      })
      },
      editGoods() {
        let reg = /^\d+(\.\d{1,2})?$/
        if (this.goodsInfo.styleNo === '') {
          this.$message.error('商品款号不能为空');
          return
        } else if (this.goodsInfo.salePrice === '') {
          this.$message.error('商品销售价不能为空');
          return
        } else if (!reg.test(this.goodsInfo.salePrice)) {
          this.$message.error('销售价请输入不多于两位小数的数字');
          return
        }  else if (this.goodsInfo.purchaseCost&&!reg.test(this.goodsInfo.purchaseCost)) {
          this.$message.error('标准代购费请输入不多于两位小数的数字');
          return
        }  else if (this.goodsInfo.postedPrice&&!reg.test(this.goodsInfo.postedPrice)) {
          this.$message.error('标价请输入不多于两位小数的数字');
          return
        } else if (!this.goodsInfo.brandId) {
          this.$message.error('商品品牌不能为空');
          return
        }  else if (this.goodsInfo.supplierStyleNo != null&&this.goodsInfo.supplierStyleNo.length > 20) {
          this.$message.error('供应商款号最多只能输入20个字符');
          return
        } else if (!this.goodsInfo.imageUrlList.length) {
          this.$message.error('商品图片不能为空');
          return
        } else if (this.goodsInfo.imageUrlList.length < 4) {
          this.$message.error('商品图片至少上传4张图片');
          return
        } else if (!this.goodsInfo.goodsSpecParamList.length) {
          this.$message.error('规格信息不能为空');
          return
        } else if (!this.goodsInfo.remark) {
          return this.$message.error('文字描述不能为空')
        }
        let arr = []
        for (let i = 0; i < this.goodsInfo.goodsSpecParamList.length; i++) {
          arr.push(this.goodsInfo.goodsSpecParamList[i].goodsSpecName)
          if ((this.goodsInfo.goodsSpecParamList[i].goodsSpecName === '') || (this.goodsInfo.goodsSpecParamList[i].stock === '')) {
            console.log(this.goodsInfo.goodsSpecParamList[i].goodsSpecName);
            this.$message.error('规格信息不能为空');
            return
          }
        }
        if (this.specRet(arr)) return
        this.btnLoading = true
        if (this.$route.query.goodsId) {
          // 编辑
          this.goodsInfo.userId = this.$store.getters.userInfo.userId
        }
        if (!this.goodsInfo.purchaseCost) this.goodsInfo.purchaseCost = 0

        console.log(this.goodsInfo, '参数');
        saveGoods(this.goodsInfo).then(res => {
          this.btnLoading = false
        if(res.code==0){
          this.$message.success(this.$route.query.goodsId?'编辑成功':'新建成功')
          this.$router.go(-1)
        }else {
          this.$message.error(res.msg)
        }
      })
      },
      // 规格名称查重
      specRet(arr) {
        let res = [];
        let json = {};
        for (let i = 0; i < arr.length; i++) {
          if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
          } else {
            this.$message.error('规格名称不能重复');
            return true
          }
        }
      },
      batchEdit(v) {
        for (let i = 0; i < this.goodsInfo.goodsSpecParamList.length; i++) {
          this.goodsInfo.goodsSpecParamList[i].stock = v
        }
      },
      addSpec() {
        this.goodsInfo.goodsSpecParamList.push({goodsSpecName: '', stock: '', goodsSpecId: ''})
      },
      delSpec(scope) {
        console.log(scope);
        if (scope.goodsSpecId) {
          let params = {goodsSpecId: scope.goodsSpecId}
          checkIfBound(params).then(res => {
            this.goodsInfo.goodsSpecParamList.splice(scope.$index, 1)
        })
        } else {
          this.goodsInfo.goodsSpecParamList.splice(scope.$index, 1)
        }
      },
      leftImg() {
        if (this.imgIndex !== 0) {
          this.imgIndex--
        }
      },
      rightImg() {
        if (this.imgIndex < this.goodsInfo.imageUrlList.length - 1) {
          this.imgIndex++
        }
      }
    },
    computed: {
      totalStock() {
        let count = 0
        for (let i = 0; i < this.goodsInfo.goodsSpecParamList.length; i++) {
          count += this.goodsInfo.goodsSpecParamList[i].stock * 1
        }
        return count
      }
    },
    components: {
      draggable
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .goods-edit{
    .table-tr{
      .el-input__inner{
        border:none !important;
      }
    }
    .comtent-item{
      width: 66%;
      input{
        width: 592px;
      }
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .goods-edit {

    // 表格
    .table-title,.table-tr {
      display:flex;
      justify-content:space-around;
      align-items: center;
      border: 1px solid $divideBorder;
      border-top:none;
      color: #909399;
      font-size:14px;
      height:48px;
      line-height: 48px;
      >div{
        width:232px;
        border-right:1px solid $divideBorder;
        text-align:left;
        padding-left:15px;
        &:last-child{border-right:none;}
      }
    }
    .table-title{
      background-color: #FAFAFA;
      font-weight:600;
      border-top: 1px solid $divideBorder;
    }
    .content-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      padding: 18px 0;
      border-bottom: 1px solid $divideBorder;
    }
    .content-main {
      padding: 24px 0;
      position: relative;
      .tip {
        position: absolute;
        width: 150px;
        height: 90px;
        right: 0;
        top: 0;
      }
      .info-group {
        font-size: 14px;
        .label-item {
          float: left;
          width: 33%;
          margin-bottom: 10px;

          > span {
            text-align: right;
            width: 84px;
            display: inline-block;
            i {
              font-style: normal;
              line-height: 16px;
              color: $sysRed;
            }
          }
          .el-input, .el-select {
            width: 232px;
          }
        }
      }
      .label-group {
        margin-top: 16px;
        .del {
          color: $functionText;
          display: inline-block;
          cursor: pointer;
        }
        .desc {
          font-size: 14px;
          float: left;
        }
        .label-title {
          width: 84px;
          float: left;
          font-size: 14px;
          text-align: right;
          > span {
            color: $auxiliaryText;
          }
        }
        ul {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          width: 800px;
          padding: 0;
          li {
            width: 100px;
            height: 100px;
            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;
            cursor: pointer;
            overflow: hidden;
            .mask {
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              background: rgba(0, 0, 0, .7);
              z-index: 999;
              .set-cover {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                line-height: 24px;
                color: $sysGolden;
                font-size: 12px;
                text-align: center;
                background: #000;
              }
            }
            .faceStyle {
              text-align: center;
              position: absolute;
              top: -13px;
              right: -23px;
              z-index: 777;
              transform: rotateZ(45deg);
              color: $sysGolden;
              font-size: 12px;
              background: $sysBlack;
              width: 56px;
              height: 36px;
              span {
                position: absolute;
                width: 36px;
                left: 50%;
                transform: translateX(-50%);
                bottom: 0;
              }
            }
            a {
              border-radius: 0;
              position: relative;
              display: inline-block;
              height: 100%;
              width: 100%;
              .imgCancel {
                position: absolute;
                top: 3px;
                right: 5px;
                cursor: pointer;
                display: inline-block;
                height: 12px;
                width: 12px;
              }
              .faceSelect {
                position: absolute;
                bottom: 0;
                height: 26px;
                width: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              }
            }
            img {
              width: 100%;
              height: 100%;
            }
          }
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
  }

</style>
