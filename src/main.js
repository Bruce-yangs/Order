// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
// import router from './router';
import  goods from 'components/goods/goods'
import  ratings from 'components/ratings/ratings'
import  seller from 'components/seller/seller'

//引入全局样式
import 'common/stylus/index.styl';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  linkActiveClass: 'active',//点击加入的高亮样式
  routes: [
    {
      path: '/',
      redirect: '/goods'//路由重定向 进入默认页面
    }, {
      path: '/goods',
      component: goods
    }, {
      path: '/ratings',
      component: ratings
    }, {
      path: '/seller',
      component: seller
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
 /* template: '<App/>',
  components: { App }*/
  render: h => h(App)
});
