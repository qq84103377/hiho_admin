<template>
  <div class="brand-list">
    <filterPanel :multiple="false" @submitSearch="keywordSearch" @selectSearch="activitySearch" :checkboxInfo="checkboxInfo" :filterText="filterText">

      <div slot="footer">
        <div class="select-group">
          <span>上架情况:</span>
          <el-select @change="selectFn" v-model="goodsStatus" clearable placeholder="不限">
            <el-option
              v-for="item in options.ground"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-group">
          <span>销售情况:</span>
          <el-select @change="selectFn" v-model="saleStatus" clearable placeholder="不限">
            <el-option
              v-for="item in options.sale"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-group">
          <span>创建时间:</span>
          <el-date-picker
            @change="selectTime"
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
    </filterPanel>
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%;border: 1px solid #ebeef5;border-bottom: none;margin-top: 16px;"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="name"
        label="品牌"
        sortable
      >
        <template slot-scope="scope">
         <div style="display: flex;align-items: center;">
           <div style="height: 40px;margin-right: 12px;flex: 0 0 40px">
             <img v-if="scope.row.logoPath" :src="scope.row.logoPath" style="width: 100%;height: 100%;border: none;">
           </div>
          <span>{{scope.row.name}}</span>
         </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="inSaleGoodsNum"
        label="上架商品"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="inActivityNum"
        label="进行中活动"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="noticedNum"
        label="关注数"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="saleNum"
        label="累计销售"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="创建时间"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="80">
        <template slot-scope="scope">
          <div class="iconfont icon-check" style="color: #3C8EEF;cursor: pointer;" @click="$router.push({path:'/brandDetail/goodsList',query:{brandId:scope.row.id}})">查看</div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col class="page-content">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="20"
        layout="prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>

  </div>
</template>

<script>
  import {listBrand} from '@/api/brand.js'

  export default {
    name: 'brandList',
    data() {
      return {
        loading: false,
        totalCount: 0,
        keyword: '',
        tableData: [],
        saleStatus: '',
        goodsStatus: '',
        options: {
          ground: [{
            value: 'hasUp',
            label: '有上架商品'
          }, {
            value: 'allDown',
            label: '商品已全部下架'
          }, {
            value: 'noGoods',
            label: '无商品'
          }], sale: [{
            value: 'hasSale',
            label: '有销量'
          }, {
            value: 'noSale',
            label: '无销量'
          }]
        },
        time: '',
        filterText: {
          value1: '品牌搜索',
          value2: '输入品牌名称搜索',
          value3: '活动状态',
        },
        checkboxInfo: [{name: '有进行中活动', isActive: false, id:'hasAct'}, {name: '活动已全部结束', isActive: false, id:'allEnd'}, {name: '无活动', isActive: false, id:'noAct'}],
      }
    },
    methods: {
      selectTime(v) {
        this.startCreateTimeFilter = v ? Number(new Date(v[0])) / 1000 : ''
        this.endCreateTimeFilter = v ? (Number(new Date(v[1])) + 86399000) / 1000 : ''
        this.getBrandList()
      },
      selectFn() {
        this.getBrandList()
      },
      activitySearch(v){
        this.activityFilter = v
        this.getBrandList()
      },
      // 分页
      handleCurrentChange(e) {
        this.getBrandList(e)
      },
      keywordSearch(v) {
        this.keyword = v
        this.getBrandList()
      },
      getBrandList(num) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          actStatus: this.activityFilter || '',
          goodsStatus: this.goodsStatus,
          saleStatus: this.saleStatus,
          startCreateTimeFilter: this.startCreateTimeFilter,
          endCreateTimeFilter: this.endCreateTimeFilter,
          pageNum: num || 1,
          pageSize: 20
        }
        console.log(params,'筛选参数');
        listBrand(params).then(res => {
          this.loading = false
          console.log(res, '品牌列表')
          this.tableData = res.data.brandOneResponseList
          this.totalCount = res.data.totalCount
        })
      }
    },
    created() {
        this.getBrandList()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
