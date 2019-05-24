<template>
  <transition name="el-fade-in">
    <div class="preview-wrap" v-if="show">
      <div class="preview-demo">
        <div class="preview-demo__title"> {{title}}</div>
        <div class="preview-demo__content" v-html="content"></div>
      </div>
      <div class="cover1" @click="popHide">
      </div>
    </div>
  </transition>
</template>


<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    },
    created() {
    },
    methods: {
      popHide() {
        this.$emit('update:show', false)
      },
    },
    watch: {}
  }
</script>
<style lang="scss">
  .preview-demo {
    &__content {
      img {
        max-width: 100% !important;
      }
    }
  }

</style>
<style lang="scss" scoped>
  @import 'src/styles/variables.scss';

  .preview-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .preview-demo {
    width: 375px;
    height: 667px;
    background: url("../../assets/question-moblie-preview-bg@3x.png") no-repeat;
    background-size: 100% 100%;
    z-index: 101;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    &__title {
      color: #fff;
      font-size: 16px;
      position: absolute;
      top: 23%;
      left: 29%;
      width: 186px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__content {
      margin-top: 198px;
      padding: 0 55px;
      height: 326px;
      overflow-y: auto;
      word-break: break-all;
      &::-webkit-scrollbar {
        display: none
      }
    }
  }

  .cover1 {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
    top: 0;
    left: 0;
    z-index: 100;
  }

</style>
