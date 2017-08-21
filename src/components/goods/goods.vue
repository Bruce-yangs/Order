<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
              <ul><!--:class="{'current' : currentIndex === index}" -->
                <li v-for="(item,index) in goods" class="menu-item"  :class="{'current' : currentIndex == index}" @click="selectMenu(index,$event)" ref="menuList"><!--下标相同加高亮-->
                  <span class="text border-1px">
                    <span class="icon" :class="classMap[item.type]" v-show="item.type>0"></span>{{item.name}}
                  </span>
                </li>
              </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
              <ul>
                <li v-for="item in goods" class="food-list" ref="foodList">
                  <h1 class="title">{{item.name}}</h1>
                  <ul>
                    <li v-for="food in item.foods" class="food-item border-1px">
                      <div class="icon">
                        <img :src="food.icon" width="57">
                      </div>
                      <div class="content">
                        <h2 class="name">{{food.name}}</h2>
                        <p class="desc">{{food.description}}</p>
                        <div class="extra">
                          <span class="count">月售{{food.sellCount}}</span>
                          <span>好评率{{food.rating}}%</span>
                        </div>
                        <div class="price">
                          <span class="now">￥{{food.price}}</span>
                          <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                        </div>
                        <div class="cartcontrol-wrapper">
                          <!--此处调用cartcontrol 里的自定义事件 @add   addFood是当前的一个方法接受 子传父的信息 -->
                          <cartcontrol @add="addFood" :foods="food"></cartcontrol>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        </div><!--:select-foods="selectFoods"-->
    </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  const ERR_OK = 0;//定义全局常量
  export default {
      props: {
          seller: {
              type: Object
          }
      },
      data(){
         return {
             goods: [],
             listHeight: [],
             scrollY: 0,//要跟踪这个Y轴变量的值
             selectedFood: {}
         }
      },
      created(){
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];//icon
          this.$http.get('api/goods').then((response)=> {
            response = response.body;
            if (response.errno === ERR_OK) {
//          console.log(response)
              //Object.assign()用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。相当于 $.extend({},obj,true)
//              this.goods = Object.assign({}, this.goods, response.data);
              this.goods = response.data ;
              this.$nextTick(() => {
                this._initScroll();
                this._calculateHeight();
              })
            }
          })
      },
    methods:{
      //当选中左侧对应的下标后 右侧对应其 区间位置
      selectMenu(index, event) {
          //阻止浏览器点击时 触发2次 click 事件 (会和betterScroll 的 click 冲突)
        if (!event._constructed) {
          return;
        }
        //获取到当前元素信息
        let foodList = this.$refs.foodList;
        let el = foodList[index];//通过下标找到  el 滚动到的目标元素
        this.foodsScroll.scrollToElement(el, 300);//scrollToElement -> 滚动到指定的目标元素
      },
      //初始化 better-scroll
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
            click : true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {//this.$refs.foodsWrapper   拿到对应的元素
          click: true,
          probeType: 3//当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
        });

        //监听滚动事件
        this.foodsScroll.on('scroll',(pos) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
            if(pos.y <= 0){
              this.scrollY = Math.abs(Math.round(pos.y));//Math.abs 取正值  Math.round 四舍五入
            }
          //  console.log(this.scrollY);
          /*当拿到这个Y轴的值 后  去和左侧菜单栏  做一个下标映射关联*/
        });
      },
      _calculateHeight(){
        let foodList = this.$refs.foodList;
        let height = 0;//此处是第一个li 的区间高度
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];//获得每一个li
          height += item.clientHeight;//获得每一个li 所在当前位置的高度 ->这个高度是叠加起来的
          this.listHeight.push(height);
        }
        // console.log(this.listHeight);
      },
      _followScroll(index) {//左侧菜单栏 跟随滚动
        let menuList = this.$refs.menuList;
        let el = menuList[index];
        this.menuScroll.scrollToElement(el, 300, 0, -100);
      },
      _drop(target) {
        // 体验优化,异步执行下落动画  因为子组件shopcart里的动画 和 点击添加按钮动画 一起 出现会卡  所以此处 进行异步优化
        this.$nextTick(() => {
//           console.log(target);
           //此处的shopcart 是shopcart ref绑定的变量 接口
          this.$refs.shopcart.drop(target);
        });
      },
      addFood(target) {

        this._drop(target);
      },
    },
    computed: {
        currentIndex() {//实时计算当前左侧菜单的索引值
            for(let i = 0; i < this.listHeight.length; i++){
                let heightOne = this.listHeight[i];//区间1
                let heightTwo = this.listHeight[i + 1];//区间2    !heightTwo -> 因为this.listHeight[i+1] 会超出当前索引值 所以加限定条件
                //如果 this.scrollY 的值 大于区间1  && 小于 区间2  就返回当前索引
                if(!heightTwo || (this.scrollY >= heightOne && this.scrollY < heightTwo)) {
                  console.log(i);//查看当前对应的索引值
                  this._followScroll(i);
                  return i ;
                }
            }
            return 0 ;
        },
        selectFoods() {//此处是传给购物车相关 数据（如：数量，价钱）
            let foods = [];
            this.goods.forEach((good) => {
              good.foods.forEach((food) => {
                if (food.count) {
                  foods.push(food);
                }
              });
            });
            return foods;
        }
    },
    components:{
      shopcart,cartcontrol
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .goods
    position absolute
    width 100%
    top 174px
    bottom 46px
    display flex
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        line-height 14px
        padding 0 12px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7,17,27,.1))
          font-size 12px
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(143,153,159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7,17,27,.1))
        &:last-child
         border-none()
         margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            font-size 14px
            line-height 14px
            color rgb(7,17,27)
          .desc,.extra
            color rgb(143,153,159)
            font-size 10px
            line-height 10px
          .desc
            line-height 13px
            margin-bottom 8px
          .extra
            .count
             padding-right 10px
          .price
            font-weight 700
            line-height 24px
            .now
             margin-right 8px
             font-size 14px
             color rgb(240,20,20)
            .old
              text-decoration line-through
              font-size 10px
              color rgb(143,153,159)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
