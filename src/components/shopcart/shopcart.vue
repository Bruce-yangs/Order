<template>
    <div>
        <div class="shopcart">
          <div class="content">
            <div class="content-left">
              <div class="logo-wrapper">
                <div class="logo" :class="{'highlight':totalCount>0}">
                  <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
                </div>
                <div class="num" v-show="totalCount>0">{{totalCount}}</div>
              </div>
              <div class="price" :class="{'highlight':totalCount>0}">
                ￥{{totalPrice}}
              </div>
              <div class="desc">
                另需配送费￥{{deliveryPrice}}元
              </div>
            </div>
            <div class="content-right">
              <div class="pay" :class="payClass">
                {{payDese}}
              </div>
            </div>
          </div>
          <div class="ball-container">
            <div v-for="ball in balls">
              <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop"><!--动画 3个钩子-->
                <div class="ball" v-show="ball.show">
                  <div class="inner inner-hook"></div>
                </div>
              </transition>
            </div>
          </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
//  import cartcontrol from 'components/cartcontrol/cartcontrol';

  export default {
      props:{
        selectFoods:{//通过数据 监听判断
            type:Array,
            default(){
                return [
                  {
                      price:20,
                      count:1
                  }
                ];
            }
        },
        deliveryPrice:{
          type:Number,
          default:0
        },
        minPrice:{
          type:Number,
          default:0 //default当没有值得时候  默认是0
        }
      },
      data(){
          return {
//            deliveryPrice:0
            balls: [
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              }
            ],
            dropBalls: []
          }
      },
      computed: {
          totalPrice() {//选中商品总额
            let total = 0;
            this.selectFoods.forEach((food) => {
              total += food.price * food.count;
            });
            return total;
          },
          totalCount() {//选中商品总数
            let count = 0;
            this.selectFoods.forEach((food) => {
              count += food.count;
            });
            return count;
         },
          payDese() {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`
            }else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
              return `还差￥${diff}元起送`;
            }else{
              return '去结算';
            }
          },
          payClass() {
            if(this.totalPrice < this.minPrice) {
              return 'not-enough';
            }else{
              return 'enough';
            }
          }
      },
      methods: {
        drop(el) {
//          console.log(el)
          for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            if (!ball.show) {
              ball.show = true;
              ball.el = el;//保留el，计算是需要的
              this.dropBalls.push(ball);
              return;
            }
          }
        },
        beforeDrop(el) {//遍历所有show=true小球 做动画
          let count = this.balls.length;
          while (count--) {
              let ball = this.balls[count];
              if(ball.show) {
                let rect = ball.el.getBoundingClientRect();//此方法 获取当前元素的 视口位置 返回left top 视口偏移值
                console.log(rect)
                //此处是 拿到 当前的 X Y轴的 偏移
                let x = rect.left -32;//X轴为正值
                let y = -(window.innerHeight - rect.top -22);//Y轴为负值
                el.style.display = '';
                el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                el.style.transform = `translate3d(0,${y}px,0)`;
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                inner.style.transform = `translate3d(${x}px,0,0)`;
              }
          }
        },
        dropping(el) {
          let rf = el.offsetHeight;//重绘当前位置   只有重绘后 下面Transform 才有用
//          console.log(rf);
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0,0,0)';
            el.style.transform = 'translate3d(0,0,0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0,0,0)';
            inner.style.transform = 'translate3d(0,0,0)';
          });
        },
        afterDrop(el) {
            //做动画时  去当前 dropBalls
          let ball = this.dropBalls.shift();
          if(ball){
            ball.show = false;//这样就又可以利用ball
            el.style.display = 'none';
          }
        },
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255,255,255,.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background rgb(43,52,60)
            text-align center
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            color #fff
            font-weight 700
            font-size 9px
            background rgb(240,20,20)
            box-shadow 0px 4px 8px 0px rgba(0,0,0,.4)
            border-radius 16px
        .price
          display inline-block
          font-weight 700
          margin-top 12px
          vertical-align top
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px soild rgba(255,255,255,.1)
          font-size 16px
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105
        background: #2b343c
        .pay
          line-height 48px
          height 48px
          font-size 12px
          text-align center
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
</style>
