<template>
    <div class="star" :class="starType">
      <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" key="index"></span>
    </div>
</template>

<script type="text/ecmascript-6">
  //定义常量 灵活扩展 如将来可能6颗星的 情况只需把 LENGTH = 6 即可
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';
    export default {
        props:{
            size:{//大小
                type:Number
            },
            score:{//分数
              type:Number
            }
        },
        computed:{
          starType(){
              return 'star-'+this.size;
          },
          itemClasses(){
            let result = [];
            let score = Math.floor(this.score * 2) / 2; //分数的算法  向下取整
            let hasDecimal = score % 1 !== 0;//判断是否含有小数 如：3.5
            let integer = Math.floor(score);//此处知道有多少个 全星

            for(let i = 0;i < integer; i++){
              result.push(CLS_ON);//搜集全星
            }
            if(hasDecimal){
              result.push(CLS_HALF);//搜集半星  半星只有一个
            }
            while (result.length < LENGTH){//当星数小于5颗星的时候 此时都是 没有的星 off
                result.push(CLS_OFF);
            }
            return result;
          }
        }
    }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .star
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
         width: 15px
         height: 15px
         margin-right: 6px
         background-size: 15px 15px
         &:last-child
           margin-right: 0
         &.on
           bg-image('star36_on')
         &.half
           bg-image('star36_half')
         &.off
           bg-image('star36_off')
    &.star-24
      .star-item
         width: 10px
         height: 10px
         margin-right: 3px
         background-size: 10px 10px
         &:last-child
           margin-right: 0
         &.on
            bg-image('star24_on')
         &.half
            bg-image('star24_half')
         &.off
            bg-image('star24_off')
</style>
