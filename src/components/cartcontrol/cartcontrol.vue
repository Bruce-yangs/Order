<template>
    <div>
        <div class="cartcontrol">
          <transition name="move">
            <div class="cart-decrease" v-show="foods.count>0" @click="decreaseCart">
              <span class="inner icon-remove_circle_outline"></span>
            </div>
          </transition>
            <div class="cart-count" v-show="foods.count>0">{{foods.count}}</div>
          <div class="cart-add icon-add_circle" @click="addCart"></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';
    export default {
        props: {
          foods: {
                type: Object
            }
        },
        methods: {
          addCart(e) {
              if(!e._constructed){//阻止PC端 重复点击
                  return ;
              }
              if(!this.foods.count) {
                Vue.set(this.foods,'count',1)
//                this.food.count = 1;
              }else{
                this.foods.count ++;
              }

              //此处的add 是自定义事件名称  在goods组件 中调用方法是  @add
            this.$emit('add', event.target);//获得点击对象的 参数值
          },
          decreaseCart(e) {//减
            if(!e._constructed){
              return ;
            }
            if(this.foods.count) {
              this.foods.count --;
            }
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6
      opacity 1
      transform translate3d(0, 0, 0)
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        color rgb(0,160,220)
        transition all .3s linear
        transform: rotate(0)
      &.move-enter-active,&.move-leave-active
        transition all .3s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(240deg)
    .cart-count
       display inline-block
       font-size 12px
       width 12px
       padding-top 6px
       line-height 24px
       color rgb(147 , 153 ,159)
       text-align center
       vertical-align top
    .cart-add
       display inline-block
       padding 6px
       line-height 24px
       font-size 24px
       color rgb(0,160,220)

</style>
