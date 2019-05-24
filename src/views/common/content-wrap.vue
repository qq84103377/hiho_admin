<template>
  <div class="content_wrap">
    <div class="content_wrap--head">
      <div class="head-left">
          <div>{{title}}</div>
      </div>
      <div class="head-right">
        <slot name="btn">
        </slot>
      </div>
    </div>
    <div class="content_wrap--content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
    export default {
        name: "content-wrap",
      props:['title']
    }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .content_wrap {
    &--head {
      display: flex;
      justify-content: space-between;
      .head-left{
        line-height: 40px;
        font-size: 24px;
        color: $sysBlack;
      }
      .head-right{
        /*width: 116px;*/
      }
    }

    &--content {
      // overflow: hidden;
      margin-top: 16px;
      background: #fff;
      padding: 0 32px;
    }

  }
</style>
