<template>
  <div :startTime="startTime" :endTime="endTime" :callback="callback">
      {{content}}{{type =='ongoing' ? '结束': '开始'}}
  </div>
</template>
<script>
  export default {
    data(){
      return {
      content: '',
      type: this.status
      }
    },
    props:{
      startTime:{
        type: String,
        default :''
      },
      endTime:{
        type: String,
        default :''
      },
      status:{
        type: String,
        default :''
      },
      callback:{
        type: Function,
        default: function(){}
      }
    },
    watch: {
        status (val) {
            this.type = val
            console.log(this.type)
        }
    },
    created() {
        if (this.startTime&&this.endTime) {
            this.countdowm(this.startTime,this.endTime)
        }
    },
    methods: {
      countdowm(d1,d2){
      let self = this
      let timer = setInterval(function(){
        let s1 = new Date().getTime(), s2 = new Date(d1).getTime(), s3 = new Date(d2).getTime()
        let total = s1 > s2 ? (s3 - s1)/1000 : (s2 - s1)/1000
        self._callback()
        if(total>0){
          let dates=parseInt(total/(24*3600))
          let hours=parseInt(total%(24*3600)/3600)
          let iMinutes=parseInt(total%3600/60)
          let iSecends=parseInt(total%60)
          hours = hours < 10 ? `0${hours}` : hours
          iMinutes = iMinutes < 10 ? `0${iMinutes}` : iMinutes
          iSecends = iSecends < 10 ? `0${iSecends}` : iSecends
          self.content = `还有${dates}天${hours}:${iMinutes}:${iSecends}`
          }else{
          self.$emit('clockerEnd')
          clearInterval(timer)
          self.content = self.endText
          self._callback()
          }
         },1000)
        },
        _callback(){
        if(this.callback && this.callback instanceof Function){
           this.callback(...this)
         }
      }
    }
  }
</script>
