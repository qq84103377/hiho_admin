<template>
  <div>
    <script  :id=id type="text/plain"></script>
  </div>
</template>
<script>
  import '../../static/UE/ueditor.config'
  import '../../static/UE/ueditor.all'
  import '../../static/UE/lang/zh-cn/zh-cn'

  export default {
    name: 'UE',
    data() {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      id: {
        type: String
      },
      index: {
        type: Number
      },
      item: {
        type: Object
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id, {
        ..._this.config,
        toolbars: [
          ['undo', 'bold', 'redo', 'indent', 'italic', 'underline', 'strikethrough', 'subscript', 'imagecenter', 'simpleupload']
        ]
      }); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
      this.editor.addListener("contentChange", this.contentChange,);
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      setUEContent(string) { // 写入内容方法
        return this.editor.setContent(string)
      },
      getPlainTxt() {
        return this.editor.getPlainTxt()
      },
      getAllHtml(string) {
        return this.editor.getAllHtml(string);
      },
      render(el, dom) {
        return this.editor.render(el, dom);
      },
      contentChange() {
        this.item && this.$emit('htmlData', this.index, this.item);
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
