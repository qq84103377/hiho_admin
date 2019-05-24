<template>
  <div class="activity-detail">
    <content-wrap title="活动详情">
      <el-button slot="btn" @click="$router.go(-1)">返回</el-button>
    </content-wrap>
    <div class="addForm">
      <div class="clearfix border">
        <div class="formTitle">活动信息</div>
        <el-button class="edit-btn" plain @click="$router.push({path:'/activity/edit', query:{id:$route.query.id}})" icon="el-icon-edit-outline" v-if="status != 'end'">编辑</el-button>
      </div>
      <el-form :model="addForm" ref="addForm" label-width="100px" class="form-readonly mgt16 mgb16"
               :inline="true">
        <el-row class="posR">
          <el-form-item label="品牌：" class="width232">
            <div class="width230">{{addForm.brandName}}</div>
          </el-form-item>
          <el-form-item label="活动名称：" class="width232">
            <div class="width230">{{addForm.name}}</div>
          </el-form-item>
          <div class="status posA">
            <div v-if="status !== 'end'" class="auxiliaryText">
              <div :class="[status == 'ongoing'? 'sysBlue' : '', 'fs18', 'txtR', 'mgb8']">{{statusMap[status]}}</div>
              <div class="fs14" style="color:#29292A;">
                <count-down v-if="time" :startTime="startTime" :endTime="time" :status="status" :callback="changeStatus"></count-down>
              </div>
            </div>
            <div v-else-if="status === 'end'">
              <div style="color:#29292A;" class="fs18">{{statusMap[status]}}</div>
            </div>
          </div>
        </el-row>
        <el-row>
          <el-form-item label="开始时间：" class="width232">
            <div class="width230">{{addForm.startTime}}</div>
          </el-form-item>
          <el-form-item label="结束时间：" class="width232">
            <div class="width230">{{addForm.endTime}}</div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="活动介绍：" class="width232">
            <div style="width:579px;">
              <p v-for="item in addForm.remark.split('\n')">{{item}}</p>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <div class="label-group clearfix">
            <span class="label-title">活动图片：</span>
            <div style="float: left;">
              <span v-if="addForm.activityPictures.length ==0">无</span>
              <pic-list :isEdit="false" :fileList="addForm.activityPictures"></pic-list>
            </div>
          </div>
        </el-row>
        <el-row>
          <el-form-item label="合成图片：" class="width232">
            <span v-if="addForm.remixPicture == ''" class="auxiliaryText">无</span>
            <pic-list v-else :fileList="addForm.remixPicture !== '' ? [this.addForm.remixPicture] : []" class="img" :isEdit="false" :isCover="false" ></pic-list>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="good-list addForm">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`活动商品(${tableData.length})`" name="first">
          <div class="mgl32 mgt24 mgb8">累计销售：{{sum}}</div>
          <el-row style="padding: 0 32px 32px;">
            <el-table
              :data="tableData"
              style="width:100%;"
              border
            >
              <template v-for="e in clos">
                <el-table-column
                  v-if="e.prop === 'name'"
                  :prop="e.prop"
                  :label="e.label"
                  :sortable="e.sortable"
                  :width="e.width ? e.width : ''"
                  :key="e.label">
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
                  :width="e.width"
                  :key="e.label">
                </el-table-column>
              </template>
              <el-table-column
                prop="activity"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" :disabled="true" class="mgr5"><i class="iconfont icon-edit mgr5 sysBlue"></i><span class="fs14 sysBlack">修改在售库存</span></el-button>
                  <el-button type="text" size="small" :disabled="true"><i class="iconfont icon-delete mgr5 sysRed"></i><span class="fs14 sysBlack">删除</span></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="`关注本活动的用户(${totalCount})`" name="second">
          <el-row style="padding: 0 32px 32px;">
            <user-list @handleCurrentChange="v => getUserListFn(v)" v-loading="loading" :tableData="userTableData" :totalCount="totalCount" :pageSize="20"></user-list>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { activityDetail, goodsOfActivity } from '@/api/activity.js'
  import { getUserList } from '@/api/user.js'
  import { getPictureUploadToken } from '@/api/upload.js'
  import countDown from './components/countdown.vue'
  import userList from '../user/customer/components/user-list.vue'
  export default {
    name: 'activityDetail',
    components: { countDown, userList },
    data() {
      return {
        showEdit: false,
        addForm: {
          name: '',
          brandId: '',
          remark: '',
          startTime: '',
          endTime: '',
          activityPictures: [],
          remixPicture: '',
          goodsIds: []
        },
        imgList: [],
        status: '',
        statusMap: {
          'notStart': '未开始',
          'ongoing': '进行中',
          'end': '已结束'
        },
        bandList: [
          {label: '111', velue: 1}
        ],
        uploadParams: {},
        dialogVisible: false,
        dialogImageUrl: '',
        clos: [
          {label: '商品', prop: 'name', sortable: false},
          {label: '销售价', prop: 'salePrice', sortable: false},
          {label: '销售代购价', prop: 'purchaseCost', sortable: false},
          {label: '商品规格', prop: 'specs', sortable: false},
          {label: '剩余库存', prop: 'stock', sortable: true},
          {label: '累计销量', prop: 'saleSum', sortable: true},
        ],
        closs: [
          {label: '注册用户', prop: 'name', sortable: false},
          {label: '手机号码', prop: 'salePrice', sortable: false},
          {label: '用户等级', prop: 'purchaseCost', sortable: false},
          {label: '关联微信', prop: 'specs', sortable: false},
          {label: '累计下单件数', prop: 'stock', sortable: true},
          {label: '注册时间', prop: 'saleSum', sortable: true},
        ],
        goodClos: [
          {label: '商品', prop: 'name', sortable: false},
          {label: '销售价', prop: 'salePrice', sortable: false},
          {label: '标准代购价', prop: 'purchaseCost', sortable: false},
          {label: '商品规格', prop: 'specs', sortable: false},
          {label: '剩余库存', prop: 'stock', sortable: true},
          {label: '累计销量', prop: 'saleSum', sortable: true}
        ],
        tableData: [],
        goodData: [], // 商品列表
        stockData: [{date: '1111'}, {date: '2222'}, {date: '3333'}], // 库存列表
        chooseGood: false, // 选择商品
        editShow: false, // 修改
        edit: false, // 修改编辑
        isEdit: false, // 是否编辑
        activeName: 'first',
        time: null,
        startTime: null,
        total:0,
        loading: false,
        totalCount: 0,
        userTableData: []
      }
    },
    computed: {
      sum () {
        let total = 0
        this.tableData.forEach(i => {
          total +=parseInt(i.saleSum)
        })
        return total
      }
    },
    methods: {
      getUserListFn(num) {
        this.loading = true
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
          actIds: [this.$route.query.id],
          // goodsIds: this.goodsId
        }
        console.log(params,'筛选参数');
        getUserList(params).then(res => {
          console.log(res);
          this.loading = false
          this.totalCount = res.data.totalCount
          this.userTableData = res.data.users
        })
      },
      // 根据时间改变状态
      changeStatus () {
        let data = new Date().getTime()
        let endData = new Date(this.addForm.endTime).getTime()
        let startData = new Date(this.addForm.startTime).getTime()
        if(endData < data) {
          this.status = 'end'
        } else if (endData > data && startData > data) {
          this.status = 'notStart'
        } else if (endData > data && startData < data) {
          this.status = 'ongoing'
        }
      },
      async getActivityDetail () {
        let params = {
          id: this.$route.query.id
        }
        await activityDetail(params).then(res => {
          this.addForm = res.data
          this.time = this.addForm.endTime
          this.startTime = this.addForm.startTime
          let data = new Date().getTime()
          let endData = new Date(this.addForm.endTime).getTime()
          let startData = new Date(this.addForm.startTime).getTime()
          if(endData < data) {
            this.status = 'end'
          } else if (endData > data && startData > data) {
            this.status = 'notStart'
          } else if (endData > data && startData < data) {
            this.status = 'ongoing'
          }
          console.log(this.addForm, '详情')
        })
      },
      async getGoodsOfActivity () {
        let params = {
          id: this.$route.query.id,
          sortBy: 'stock',
          sortType: '1',
          pageNum: 1,
          pageSize: 100
        }
        await goodsOfActivity(params).then(res => {
          this.tableData = res.data.goods
          console.log(this.tableData, '商品详情')
        })
      },
      addGood() {
        this.chooseGood = true
      }
    },
    mounted () {
      this.getActivityDetail()
    },
    created () {
      console.log(this.$route.query.id)
      this.getActivityDetail()
      this.getGoodsOfActivity()
      this.getUserListFn()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import 'src/styles/variables.scss';
  .activity-detail {
    .el-form-item__label {
      color: $sysBlack !important;
      font-size: 14px !important;
      font-weight:400;
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
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .activity-detail {
    .color{
      color:$placeholderText;
    }
    .ml16 {
      margin-left: 16px;
    }
    .mgb8{
      margin-bottom:8px;
    }
    .txtR{
      text-align:right;
    }
    .floatR {
      float: right;
    }
    .width750 {
      width: 750px;
    }
    .width230{
      width:232px;
    }
    .addForm {
      background: #fff;
      border: 1px solid $divideBorder;
      .status{
        right:33px;
        top:0;
      }
      .border{
        border-bottom: 1px solid $divideBorder;
        .formTitle {
          padding: 18px 0 18px 32px;
          font-size: 18px;
          float:left;
        }
        .edit-btn{
          float:right;
          margin:12px 32px 0 0;
          height:36px;
          &:hover{
            color:$functionText !important;
            background-color: #fff;
            border-color:$functionText !important;
          }
        }
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
        .width579 {
          width:579px;
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
      top: 14px;
      right: 80px;
      padding: 0 8px;
      /* margin-left: 8px; */
      border: 1px solid $divideBorder;
      color: $placeholderText;
      background: #fff;
      cursor: pointer;
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
        float: left;
        font-size: 14px;
        text-align: right;
      }
    }
  }
</style>
