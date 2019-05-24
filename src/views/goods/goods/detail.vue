<template>
  <div class="goods-detail">
    <content-wrap title="商品详情">
      <el-button slot="btn" @click="$router.go(-1)">返回</el-button>
      <div>
        <div class="content-head">
          <div style="display: flex;align-items: center;">商品信息
            <div class="badge" v-if="detailInfo.status=='0'">
              在售
            </div>
          </div>
          <div>
            <el-button size="medium" @click="handleClick(detailInfo.status=='1')"
                       :class="[{'btn-type':detailInfo.status=='1'},'btn-normal','iconfont','icon-sell',{'icon-sold-out':detailInfo.status=='0'}]">
              {{detailInfo.status=='0'?'下架':'上架'}}
            </el-button>
            <el-button class="iconfont icon-edit" size="medium"
                       @click="$router.push({path:'/goodsEdit',query:{goodsId:$route.query.goodsId}})">
              编辑
            </el-button>
          </div>
        </div>
        <div class="content-main">
          <div class="tip" v-if="detailInfo.status=='1'"></div>
          <div class="info-group clearfix">
            <div class="label-item">款号：<span>{{detailInfo.styleNo}}</span></div>
            <div class="label-item">名称：<span>{{detailInfo.name}}</span></div>
            <div class="label-item">款式：<span>{{detailInfo.style}}</span></div>
            <div class="label-item">销售价：<span>¥{{detailInfo.salePrice}}</span></div>
            <div class="label-item">标准代购费：<span v-if="detailInfo.purchaseCost||detailInfo.purchaseCost==0">¥</span>{{detailInfo.purchaseCost}}
            </div>
            <div class="label-item">标价：<span v-if="detailInfo.postedPrice||detailInfo.postedPrice==0">¥</span>{{detailInfo.postedPrice}}
            </div>
            <div class="label-item">品牌：<span>{{detailInfo.brandName}}</span></div>
            <div class="label-item">品类：<span>{{detailInfo.categoryName}}</span></div>
            <div class="label-item">供应商款号：<span>{{detailInfo.supplierStyleNo}}</span></div>
            <div class="label-item" style="width: 66%">备注：<span>{{detailInfo.comment}}</span></div>
          </div>
          <div class="label-group clearfix">
            <span class="label-title">规格信息：</span>
            <el-table
              border
              :data="detailInfo.goodsSpecParamList"
              :row-style="{'color':'#29292A'}"
              style="float: left;width: 44%;margin-right: 24px;">
              <el-table-column
                prop="goodsSpecName"
                label="规格">
              </el-table-column>
              <el-table-column
                prop="stock"
                label="在售库存">
              </el-table-column>
            </el-table>
            <span style="float: left;font-size: 14px;color: #9898A1;">合计库存:{{totalStock}}</span>
          </div>
          <div class="label-group clearfix">
            <span class="label-title">商品图片：</span>
            <div style="float: left;">
              <pic-list :isEdit="false" :fileList="detailInfo.imageUrlList"></pic-list>
            </div>
          </div>
          <div class="label-group clearfix">
            <span class="label-title">描述：</span>
            <div class="desc">
              <p v-for="item in detailInfo.remark?detailInfo.remark.split('\n'):[]">{{item}}</p>
            </div>
          </div>
          <!-- <div class="label-group clearfix">
            <span class="label-title">合成图片：</span>
            <div style="float: left;">
              <pic-list v-show="imgList.length > 0" :isCover="false" :isEdit="false"
                        :fileList="imgList"></pic-list>
            </div>
          </div> -->
        </div>
      </div>
    </content-wrap>

    <el-menu :default-active="tabIndex" class="content-wrap mgt16" style="background: #fff;margin-bottom: -16px;"
             mode="horizontal"
             @select="handleSelect">
      <el-menu-item class="menu-item" index="0">参与活动({{totalCount.activityTotal}})</el-menu-item>
      <el-menu-item class="menu-item" index="1">累计销量({{saleNum}})</el-menu-item>
      <el-menu-item class="menu-item" index="2">关注本商品的用户({{totalCount.userTotal}})</el-menu-item>
    </el-menu>
    <transition name="fade" mode="out-in">
      <!--<router-view ref="child"></router-view>-->
      <!--<component :is="currComponet" @handleCurrentChange="handleCurrentChange" :tableData="tableData()" :totalCount="total" :pageSize="20"></component>-->
      <activity-list v-loading="loading.activity" v-if="tabIndex==0" @handleCurrentChange="handleCurrentChange"
                     :tableData="table.activityData"
                     :totalCount="totalCount.activityTotal" :pageSize="20"></activity-list>
      <sales-list v-loading="loading.sales" v-if="tabIndex==1" @handleCurrentChange="handleCurrentChange"
                  :tableData="table.salesData"
                  :totalCount="totalCount.salesTotal" :pageSize="20"></sales-list>
      <user-list v-loading="loading.user" v-if="tabIndex==2" @handleCurrentChange="handleCurrentChange"
                 :tableData="table.userTableData"
                 :totalCount="totalCount.userTotal" :pageSize="20"></user-list>
    </transition>

    <!--上下架商品-->
    <el-dialog
      :title="popInfo.title"
      :visible.sync="popGround"
      width="34%">
      <span>{{popInfo.content}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="popGround = false">取 消</el-button>
    <el-button :loading="loading.btnLoading" type="primary" @click="upDownGoods">{{popInfo.confirmBtn}}</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import {listActivity} from '@/api/activity.js'
  import {showGoodsDetail, downGoods, upGoods, getSaleNum} from '@/api/goods.js'
  import activityList from '../../activity/components/activity-list'
  import userList from '../../user/customer/components/user-list'
  import salesList from '../../order/sales/components/salesList'
  import {getUserList} from '@/api/user.js'
  import {getOrderList} from '@/api/order.js'

  export default {
    name: 'goodsDetail',
    data() {
      return {
        saleNum: 0,
        tabIndex: '0',
        popInfo: {},
        popGround: false,
        detailInfo: {goodsSpecParamList: []},
        imgList: [],
        // tableData: [],
        totalCount: {
          activityTotal: 0,
          salesTotal: 0,
          userTotal: 0
        },
        table: {
          activityData: [],
          salesData: [],
          userTableData: []
        },
        loading: {
          btnLoading: false,
          activity: false,
          user: false,
          sales: false
        }
        // specInfo: [{spec: 'X', stock: 123}, {spec: 'L', stock: 321}]
      }
    },
    methods: {
      getSaleNum() {
        getSaleNum({goodsId: this.$route.query.goodsId}).then(res => {
          this.saleNum = res.data || 0
      })
      },
      handleSelect(key, keyPath) {
        this.tabIndex = key
        // this.$router.push({path: key})
        console.log(key, keyPath)
      },
      async upDownGoods() {
    this.loading.btnLoading = true
    let params = {goodsId: this.$route.query.goodsId, userId: this.$store.getters.userInfo.userId}
    if (this.detailInfo.status == 0) {
      // 下架
      await downGoods(params).then(res => {
        if (res.code == 0) {
        this.$message.success('下架成功')
      } else {
        this.$message.error(res.msg)
      }
    })
    } else if (this.detailInfo.status == 1) {
      // 上架
      await upGoods(params).then(res => {
        if (res.code == 0) {
        this.$message.success('上架成功')
      } else {
        this.$message.error(res.msg)
      }
    })
    }
    this.loading.btnLoading = false
    this.getGoodsDetail()
    this.popGround = false
  },
  handleClick(bool) {
    if (!bool) {
      this.popInfo = {
        title: '确定下架此款商品？',
        content: '下架商品后不再显示在嗨货APP中，前端活动详情中和关注中 的此货品显示已下架，不能再被下单。但不影响已占用库存的进货 车和已下单的数据。',
        confirmBtn: '确定下架'
      }
    } else {
      this.popInfo = {
        title: '确定上架此款商品？',
        content: '',
        confirmBtn: '确定上架'
      }
    }

    this.popGround = true
  },
  async getGoodsDetail() {
    let params = {goodsId: this.$route.query.goodsId}
    await showGoodsDetail(params).then(res => {
      console.log(res.data);
    this.detailInfo = res.data
    this.imgList = [this.detailInfo.remarkPicUrl, this.detailInfo.verticalPicUrl, this.detailInfo.horizontalPicUrl]
  })
  },
  getUserListFn(num) {
    this.loading.user = true
    let params = {
      keyword: '',
      levelFilter: '',
      hasWxFilter: '',
      orderFilter: '',
      createAtStartFilter: '',
      createAtEndFilter: '',
      pageNum: num || 1,
      pageSize: 20,
      sortBy: 'createAt',
      sortType: '1',
      goodsIds: [this.$route.query.goodsId]
    }
    console.log(params, '筛选参数');
    getUserList(params).then(res => {
      console.log(res);
    this.loading.user = false
    this.totalCount.userTotal = res.data.totalCount
    this.table.userTableData = res.data.users
  })
  },
  // 获取活动列表
  getActivityList(num) {
    this.loading.activity = true
    let params = {
      brandFilter: this.detailInfo.brandId,
      pageNum: num || 1,
      pageSize: 20,
      sortBy: 'createAt',
      sortType: '1',
    }
    listActivity(params).then(res => {
      this.loading.activity = false
    this.table.activityData = res.data.activities
    this.totalCount.activityTotal = res.data.totalCount
  })
  },
  // 获取订单列表
  getOrderList(num) {
    this.loading.sales = true
    let params = {
      keyword: '',
      goodsFilters: [this.$route.query.goodsId],
      // goodsFilters: [],
      userFilters: [],
      brandFilters: [],
      statusFilter: 'SENDED',
      refundStatusFilter: '',
      createOrderStartTimeFilter: '',
      createOrderEndTimeFilter: '',
      pageNum: num || 1,
      pageSize: 20,
      sortBy: 'orderAt',
      sortType: '1'
    }
    getOrderList(params).then(res => {
      this.loading.sales = false
    if (res.code === 0) {
      this.table.salesData = res.data.orders
      this.totalCount.salesTotal = res.data.totalCount
      // this.$emit('saleTotal',this.totalCount)
    }
  })
  },
  handleCurrentChange(num) {
    if (this.tabIndex == '0') {
      this.getActivityList(num)
    } else if (this.tabIndex == '1') {
      this.getOrderList(num)
    } else if (this.tabIndex == '2') {
      this.getUserListFn(num)
    }
  },
  },
  async created() {
    await this.getGoodsDetail()
    this.getActivityList()
    this.getUserListFn()
    this.getOrderList()
    this.getSaleNum()
  },
  components: {activityList, userList, salesList},
  computed: {
    totalStock() {
      let count = 0
      for (let i = 0; i < this.detailInfo.goodsSpecParamList.length; i++) {
        count += this.detailInfo.goodsSpecParamList[i].stock * 1
      }
      return count
    },
    // currComponet() {
    //   if (this.tabIndex == '0') {
    //     return activityList
    //   } else if (this.tabIndex == '1') {
    //     return salesList
    //   } else if (this.tabIndex == '2') {
    //     return userList
    //   }
    // },
    total() {
      if (this.tabIndex == '0') {
        return this.totalCount.activityTotal
      } else if (this.tabIndex == '1') {
        return 0
      } else if (this.tabIndex == '2') {
        return this.totalCount.userTotal
      }
    }
  }
  }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .goods-detail {
    color: $sysBlack;
    .content-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      padding: 18px 0;
      border-bottom: 1px solid $divideBorder;
      .badge {
        width: 40px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        padding: 0;
        text-align: center;
        margin-left: 7px;
        display: inline-block;
        color: $sysGolden;
        background: $sysBlack;
      }
      .btn-normal {
        color: $sysRed;
        border-color: $sysRed;
        &.btn-type {
          color: $sysLightGreen;
          border-color: $sysLightGreen;
        }
      }
    }
    .content-main {
      padding: 24px 0;
      position: relative;
      .tip {
        position: absolute;
        width: 140px;
        height: 56px;
        right: 0;
        top: 28px;
        background: url("../../../assets/pic_soldout.png") no-repeat;
        transform: rotateZ(15deg);
        opacity: .6;
      }
      .info-group {
        /*display: flex;*/
        font-size: 14px;
        /*color: #29292A;*/
        .label-item {
          /*flex: 1;*/
          float: left;
          width: 33%;
          margin-bottom: 10px;
        }
      }
      .label-group {
        margin-top: 16px;
        .desc {
          font-size: 14px;
          float: left;
          line-height: 22px;
        }
        .label-title {
          width: 70px;
          float: left;
          font-size: 14px;
          text-align: right;
        }
      }
    }
    .icon-edit::before {
      color: $functionText;
    }
    .menu-item {
      font-size: 18px;
    }
  }
</style>
