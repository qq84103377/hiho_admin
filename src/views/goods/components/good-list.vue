<template>
  <div class="goods-list">
    <filterPanel :multiple="false" @selectSearch="brandSearch" @submitSearch="keywordSearch"
                 v-if="$route.path=='/goods/index/goodsList'" :checkboxInfo="brandList" :filterText="filterText">
      <div slot="action-btn" style="float: right;">
        <el-button @click="isAction = !isAction" :class="['iconfont', {'icon-batch':!isAction}]" size="medium">
          {{isAction?'取消操作':'批量操作'}}
        </el-button>
        <el-button v-show="isAction" type="danger" size="medium" @click="batchHandle(4)">批量下架</el-button>
        <el-popover
          v-show="isAction"
          placement="bottom"
          width="98"
          v-model="visible2">
          <div style="text-align: right; margin: 0">
            <div class="action-item" @click="batchHandle(5)">批量删除</div>
            <div class="action-item" @click="batchHandle(6)">批量库存清零</div>
          </div>
          <el-button size="medium" style="margin-left: 10px;" slot="reference">更多操作</el-button>
        </el-popover>
      </div>
      <div slot="footer">
        <div class="select-group">
          <span>库存情况:</span>
          <el-select @change="selectFn" v-model="stock" clearable placeholder="不限">
            <el-option
              v-for="item in options.stock"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-group">
          <span>状态:</span>
          <el-select @change="selectFn" v-model="status" clearable placeholder="不限">
            <el-option
              v-for="item in options.type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-group">
          <span>创建时间:</span>
          <el-date-picker
            v-model="time"
            @change="selectTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
    </filterPanel>
    <el-table
      border
      v-loading="loading"
      :data="tableData"
      style="width: 100%;border: 1px solid #ebeef5;border-bottom: none;margin-top: 16px;"
      :default-sort="{prop: 'date', order: 'descending'}"
      :row-class-name="tableRowClassName"
      @selection-change="selectItem"
    >
      <el-table-column
        v-if="isAction"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="商品"
        prop="name"
        min-width="130"
        sortable>
        <template slot-scope="scope">
          <div style="display: flex;">
            <img style="width: 40px;height: 40px;margin-right: 12px;" :src="scope.row.picPath" alt="">
            <div>
              <div>{{scope.row.styleNo}}</div>
              <div style="color: #9898A1">{{scope.row.name}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$route.path=='/goods/index/goodsList'"
        prop="brand"
        label="品牌"
        width="104">
      </el-table-column>
      <el-table-column
        label="销售价"
        width="90">
        <template slot-scope="scope">
          <div v-if="scope.row.salePrice">¥{{scope.row.salePrice}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="标准代购价"
        prop="purchaseCost"
        sortable
        width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.purchaseCost">¥{{scope.row.purchaseCost}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="specs"
        label="商品规格"
        min-width="114">
      </el-table-column>
      <el-table-column
        prop="stock"
        label="剩余库存"
        sortable
        width="104">
      </el-table-column>
      <el-table-column
        label="状态"
        width="70">
        <template slot-scope="scope">
          <div>{{scope.row.status=='1'?'已下架':'在售'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="创建时间"
        sortable
        width="155">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <div class="check-btn iconfont icon-check"
               @click="$router.push({path:'/goodsDetail',query:{goodsId:scope.row.id}})">查看
          </div>
          <el-popover
            placement="bottom"
            width="132"
            v-model="scope.row.visible">
            <div style="text-align: right; margin: 0">
              <div :class="['action-item','iconfont','icon-sell',{'icon-sold-out':scope.row.status=='0'}]"
                   @click="itemHandle(scope.row)">
                {{scope.row.status=='0'?'下架商品':'上架商品'}}
              </div>
              <div class="action-item iconfont icon-edit" @click="editStockShow(scope.row)"> 修改在售库存</div>
              <div class="action-item iconfont icon-delete" @click="itemHandle(scope.row,3)"> 删除商品</div>
            </div>
            <div class="more-btn iconfont icon-more" slot="reference">更多</div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col class="page-content">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>

    <!--上下架删除商品-->
    <el-dialog
      :title="popInfo.title"
      :visible.sync="popGround"
      width="34%">
      <span>{{popInfo.content}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="popGround = false">取 消</el-button>
    <el-button :loading="btnLoading" type="primary" @click="upDownDelGoods()">{{popInfo.confirmBtn}}</el-button>
  </span>
    </el-dialog>

    <!--修改库存-->
    <el-dialog
      title="修改在售库存"
      :visible.sync="popStock"
      width="34%">
      <div style="position: relative;">
        <el-table
          border
          v-loading="stockLoading"
          :data="goodsSpecSimpleParamList"
          :row-style="{'color':'#29292A'}"
          style="width: 100%;">
          <el-table-column
            label="规格">
            <template slot-scope="scope">
              <div style="text-align: left">{{scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="在售库存">
            <template slot-scope="scope">
              <div v-show="!scope.row.edit" @click="editStock(scope.row)" style="text-align: left">{{scope.row.stock}}
              </div>
              <el-input @blur="scope.row.edit = false" v-if="scope.row.edit" v-model.trim="scope.row.stock"
                        v-focus="scope.row.edit" placeholder="请输入商品库存"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-input class="batch-edit" @input="batchEdit" v-model="batchStock" placeholder="批量输入"></el-input>
        <div style="text-align: right;">合计库存:{{totalStock}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="popStock = false">取 消</el-button>
    <el-button :loading="btnLoading" type="primary" @click="saveEdit">确定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listGoods,
    upGoods,
    downGoods,
    delGoods,
    batchDownGoods,
    batchDelGoods,
    batchEmptyStock,
    editStockPage,
    saveGoods,
    editStock
  } from '@/api/goods.js'
  import {listBrand} from '@/api/brand.js'

  export default {
    name: 'goodsList',
    props: {
      brandId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        btnLoading: false,
        batchStock: '',
        stockLoading: false,
        loading: false,
        time: '',
        startCreateTimeFilter: '',
        endCreateTimeFilter: '',
        brandFilter: '',
        keyword: '',
        pageSize: 20,
        pageNum: 1,
        totalCount: 0,
        goodsSpecSimpleParamList: [],
        selectArr: [],
        popInfo: {},
        popGround: false,
        popStock: false,
        brandList: [],
        filterText: {
          value1: '商品搜索',
          value2: '输入商品款号或名称搜索',
          value3: '商品品牌',
        },
        tableData: [],
        visible2: false,
        isAction: false,
        status: '',
        options: {
          stock: [{
            value: 'hasStock',
            label: '有库存'
          }, {
            value: 'noStock',
            label: '库存为0'
          }], type: [{
            value: '0',
            label: '在售'
          }, {
            value: '1',
            label: '已下架'
          }]
        },
        stock: ''
      }
    },
    created() {
      this.getGoodsList()
      this.getBrandList()
    },
    // 自动获取焦点，对input进行DOM操作，实际上；
    directives: {
      focus: {
        inserted: (el, {value}) => {
          if (value) {
            // 由于是饿了么的el-input，需要拿到父元素下面的input
            el.firstElementChild.focus();
          }
        }
      }
    },
    methods: {
      saveEdit() {
        this.btnLoading = true
        let params = {
          goodsSpecSimpleParamList: this.goodsSpecSimpleParamList
        }
        editStock(params).then(res => {
          this.btnLoading = false
          if(res.code==0){
            this.$message.success('修改成功')
            this.getGoodsList()
          }else {
            this.$message.error(res.msg)
          }
        })
        this.popStock = false
      },
      editStockShow(row) {
        this.popStock = true
        this.stockLoading = true
        let params = {goodsId: row.id, userId: this.$store.getters.userInfo.userId}
        editStockPage(params).then(res => {
          this.stockLoading = false
          this.goodsSpecSimpleParamList = res.data.goodsSpecSimpleParamList
        })
      },
      async upDownDelGoods() {
        let params = {goodsId: this.popInfo.id, userId: this.$store.getters.userInfo.userId}
        this.btnLoading = true
        if (this.popInfo.type == 1) {
          // 下架
          await downGoods(params).then(res => {
            if(res.code==0){
              this.$message.success('下架成功')
            }else{
              this.$message.error(res.msg)
            }
          })
        } else if (this.popInfo.type == 2) {
          // 上架
          await upGoods(params).then(res => {
            if(res.code==0){
              this.$message.success('上架成功')
            }else{
              this.$message.error(res.msg)
            }
          })
        } else if (this.popInfo.type == 3) {
          // 删除
          await delGoods(params).then(res => {
            if(res.code==0){
              this.$message.success('删除成功')
            }else{
              this.$message.error(res.msg)
            }
          })
        } else {
          // 批量操作
          let arr = []
          for (var i = 0; i < this.selectArr.length; i++) {
            arr.push(this.selectArr[i].id)
          }
          params = {goodsIdList: arr, userId: this.$store.getters.userInfo.userId}
          if (this.popInfo.type == 4) {
            // 批量下架
            await batchDownGoods(params).then(res => {
              if(res.code==0){
                this.$message.success('下架成功')
              }else{
                this.$message.error(res.msg)
              }
            })
          } else if (this.popInfo.type == 5) {
            // 批量删除
            await batchDelGoods(params).then(res => {
              if(res.code==0){
                this.$message.success('删除成功')
              }else{
                this.$message.error(res.msg)
              }
            })
          } else if (this.popInfo.type == 6) {
            // 批量清零
            await batchEmptyStock(params).then(res => {
              if(res.code==0){
                this.$message.success('清零成功')
              }else{
                this.$message.error(res.msg)
              }
            })
          }
        }
        this.btnLoading = false
        this.getGoodsList()
        this.popGround = false
      },
      selectTime(v) {
        this.startCreateTimeFilter = v ? Number(new Date(v[0])) / 1000 : ''
        this.endCreateTimeFilter = v ? (Number(new Date(v[1])) + 86399000) / 1000 : ''
        this.getGoodsList()
      },
      selectFn() {
        this.getGoodsList()
      },
      getBrandList() {
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
      brandSearch(v) {
        this.brandFilter = v
        this.getGoodsList()
      },
      keywordSearch(v) {
        this.keyword = v
        this.getGoodsList()
      },
      getGoodsList(num) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          brandFilter: this.brandFilter || this.brandId,
          stockFilter: this.stock,
          statusFilter: this.status,
          pageNum: num || 1,
          pageSize: this.pageSize,
          startCreateTimeFilter: this.startCreateTimeFilter,
          endCreateTimeFilter: this.endCreateTimeFilter,
        }
        console.log(params, '搜索参数');
        listGoods(params).then(res => {
          console.log(res, '商品列表')
          this.loading = false
          this.tableData = res.data.goods
          this.totalCount = res.data.totalCount
          this.$emit('count', this.totalCount)
        })
      },
      editStock(row) {
        this.$set(row, 'edit', !row.edit)
      },

      batchEdit(v) {
        for (let i = 0; i < this.goodsSpecSimpleParamList.length; i++) {
          this.goodsSpecSimpleParamList[i].stock = v
        }
      },
      // 分页
      handleCurrentChange(e) {
        this.getGoodsList(e)
      },
      tableRowClassName(row) {
        if (row.row.status == '1') {
          return 'undercarriage'
        }
      },
      selectItem(selection) {
        this.selectArr = selection
      },
      batchHandle(num) {
        if (!this.selectArr.length) {
          this.$message.error('请选择商品');
          return
        }
        this.visible2 = false
        this.popInfo = {
          title: num == 5 ? '确定删除勾选的' + this.selectArr.length + '款商品?' : (num == 6 ? '确定将勾选的' + this.selectArr.length + '款商品库存清零?' : '确定下架勾选的' + this.selectArr.length + '款商品?'),
          content: num == 5 ? '删除后商品数据将无法找回' : (num == 6 ? '勾选的所有商品的所有SKU在售库存将被修改为0' : '下架商品后不再显示在嗨货APP中，前端活动详情中和关注中的此货品显示已下架，不能再被下单。但不影响已占用库存的进货车和已下单的数据。'),
          confirmBtn: '确定' + (num == 5 ? '删除' : (num == 6 ? '清零' : '下架')),
          type: num
        }
        console.log(this.selectArr);
        this.popGround = true
      },
      itemHandle(row, num) {
        row.visible = false
        if (num) {
          this.popInfo = {
            title: '确定删除此款商品？',
            content: '删除后商品数据将无法找回',
            confirmBtn: '确定删除',
            type: 3,
            id: row.id
          }
        } else {
          row.status == '0' ? this.popInfo = {
            title: '确定下架此款商品？',
            content: '下架商品后不再显示在嗨货APP中，前端活动详情中和关注中的此货品显示已下架，不能再被下单。但不影响已占用库存的进货车和已下单的数据。',
            confirmBtn: '确定下架',
            type: 1,
            id: row.id
          } : this.popInfo = {
            title: '确定上架此款商品？',
            content: '',
            confirmBtn: '确定上架',
            type: 2,
            id: row.id
          }
        }
        this.popGround = true
      }
    },
    computed: {
      totalStock() {
        let count = 0
        for (let i = 0; i < this.goodsSpecSimpleParamList.length; i++) {
          count += this.goodsSpecSimpleParamList[i].stock * 1
        }
        return count
      }
    },
    watch: {
      popStock(v) {
        if (v) this.batchStock = ''
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .goods-list {
    overflow: hidden;
    .check-btn {
      float: left;
      color: $sysBlue;
      font-size: 14px;
      margin-right: 16px;
      cursor: pointer;
    }
    .more-btn {
      float: left;
      color: $functionText;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .action-item {
    font-size: 14px;
    line-height: 36px;
    text-align: left;
    cursor: pointer;
  }

  .batch-edit {
    position: absolute;
    left: 70%;
    top: 15px;
    width: 72px;
    height: 24px;
    font-size: 10px;
    .el-input__inner {
      height: 24px;
    }
  }
</style>
