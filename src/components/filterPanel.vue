<!-->带小黄条的box<-->
<template>
  <div class="wrap">
    <div class="filter-top">
      <span class="checkbox-title" style="margin-top: 10px;">{{filterText.value1}}:</span>
      <el-input v-model="searchContent" @input="keywordSearch" prefix-icon="el-icon-search" type="text" :maxlength=30
                :placeholder="filterText.value2"
      ></el-input>
      <slot name="action-btn"></slot>
    </div>
    <div :class="['filter-center','clearfix',{'fold':isFold}]" v-if="filterText.value3">
      <el-row>
        <el-col :span="21">
          <el-col :span="2"><span class="checkbox-title">{{filterText.value3}}:</span></el-col>
          <el-col :span="2">
            <div @click="selectAll" :class="[{'select_now':checkAll}, 'check-all']">全部</div>
          </el-col>
          <el-col :span="20">
            <ul>
              <!--<li @click="selectAll" :class="[{'select_now':checkAll}, 'check-all']">全部</li>-->
              <li @click="selectIndex(index)" :class="{'select_index':item.isActive}" v-for="(item,index) of checkboxInfo"
                  :key="index">{{item.name}}
              </li>
            </ul>
          </el-col>
        </el-col>

        <el-col :span="3">
          <span @click="isFold = !isFold" class="more">更多<i :class="['select-iocn', !isFold ? 'el-icon-arrow-up ' : 'el-icon-arrow-down']"></i></span>
        </el-col>
      </el-row>
      <!--<span class="checkbox-title">{{filterText.value3}}:</span>-->
      <!--<ul>-->
      <!--<li @click="selectAll" :class="[{'select_now':checkAll}, 'check-all']">全部</li>-->
      <!--<li @click="selectIndex(index)" :class="{'select_index':item.isActive}" v-for="(item,index) of checkboxInfo"-->
      <!--:key="index">{{item.value}}-->
      <!--</li>-->
      <!--</ul>-->
      <!--<span @click="isFold = !isFold" class="more">更多</span>-->
    </div>
    <div class="filter-footer clearfix">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchContent: '',
        isFold: true,
        checkAll: true
      }
    },
    // props: ['filterText', 'checkboxInfo',{'multiple'}],
    props: {
      filterText: {
        type: Object
      },
      checkboxInfo: {
        type: Array
      },
      multiple: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      keywordSearch(v) {
        this.$emit('submitSearch', v)
      },
      selectAll() {
        if (this.multiple) {
          //可以多选
          for (let i = 0; i < this.checkboxInfo.length; i++) {
            this.$set(this.checkboxInfo[i], 'isActive', true)
          }
          this.checkAll = true
        } else {
          //只能单选
          for (let i = 0; i < this.checkboxInfo.length; i++) {
            this.$set(this.checkboxInfo[i], 'isActive', false)
          }
          this.checkAll = true
        }
        this.$emit('selectSearch', '')
      },
      selectIndex(index) {
        let selection;
        if (this.multiple) {
          //可以多选
          this.$set(this.checkboxInfo[index], 'isActive', !this.checkboxInfo[index].isActive)
          selection = []
          for (let i = 0; i < this.checkboxInfo.length; i++) {
            if (this.checkboxInfo[i].isActive) {
              selection.push(this.checkboxInfo[i].id)
            }
          }
          this.$emit('selectSearch', selection)
          //全选样式控制
          if (!this.checkboxInfo[index].isActive) {
            this.checkAll = false
            return
          }
          var countIndex = 0
          for (let i = 0; i < this.checkboxInfo.length; i++) {
            if (!this.checkboxInfo[i].isActive) {
              countIndex++
              break
            }
          }
          if (countIndex) {
            this.checkAll = false
          } else {
            this.checkAll = true
          }
        } else {
          //只能单选
          if (this.checkboxInfo[index].isActive) {
            this.checkboxInfo[index].isActive = false
            this.checkAll = true
          } else {
            for (var i = 0; i < this.checkboxInfo.length; i++) {
              this.$set(this.checkboxInfo[i], 'isActive', false)
            }
            this.checkboxInfo[index].isActive = true
            this.checkAll = false
            selection = this.checkboxInfo[index].id
          }
          this.$emit('selectSearch', selection)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .wrap {
    margin-top: 16px;
    border: 1px solid $divideBorder;
    background: #fff;
    .checkbox-title {
      margin-top: 5px;
      margin-right: 10px;
      float: left;
      color: $sysBlack;
      font-size: 14px;
    }
    .filter-top {
      padding: 16px 24px;
      border-bottom: 1px solid $divideBorder;
    }
    .filter-center {
      position: relative;
      padding: 16px 24px 0;
      border-bottom: 1px solid $divideBorder;
      &.fold {
        height: 59px;
        overflow: hidden;
      }
      .more {
        height:36px;
        line-height: 36px;
        font-size:14px;
        color:$mainText;
        cursor:pointer;
        text-align:right;
        display:block;
        .select-iocn {
          margin-left:5px;
        }
      }
      .check-all {
        min-width: auto;
        color: $functionText;
        border: none;
        font-size: 14px;
        cursor: pointer;
        margin-top: 5px;
        &.select_now {
          color: $sysBlue
        }
      }
      ul {
        padding-left: 0;
        /*width: 920px;*/
        margin: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        li {
          min-width: 86px;
          height: 26px;
          border: 1px dashed $inputBorder;
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 16px;
          padding: 0 8px;
          margin-bottom: 16px;
          font-size: 14px;
          cursor: pointer;
          box-sizing: border-box;
          color: $sysBlack;
          &:not(.select_index):hover {
            border-color: $auxiliaryText;
          }
        }
        .select_index {
          border: 1px solid $sysBlue;
          color: $sysBlue;
        }
      }
    }
    .filter-footer {
      padding: 16px 24px;
      .select-group {
        float: left;
        margin-right: 48px;
        > span {
          color: $sysBlack;
          font-size: 14px;
          margin-right: 10px;
        }
        &:nth-child(3) {
          margin-right: 0 !important;
        }
      }
      .select-btn {
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: $sysBlack;
        cursor: pointer;
        .select-iocn {
          margin-left: 5px;
        }
      }
      .search {
        margin-top: 16px;
      }
    }
  }
</style>
