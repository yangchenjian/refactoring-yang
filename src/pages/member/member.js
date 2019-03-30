
import './member.css'

import Vue from 'vue'
// 0- 带进来
import Router from 'vue-router'

// 1- 使用vue-router
Vue.use(Router)

 // 3- 配置的router中routers的内容
 let routes = [
  {
    path: '/',
    name: 'Member',
    component: require('./components/member.vue').default,
  },
  {
    path: '/address',
    name: 'Address',
    component: require('./components/address.vue').default,
    // 配置子路由
    children: [
    // 为了不让address的组件显示空白 1- 所以用一个空路由，给空路由设定一个跳转/重定向
    // 2- 或者做一个默认的组件渲染 这里用 all 做默认组件
      {
        path: '',
        // 方法一
        // component: require('./components/all.vue').default,
        // 方法二
        name:'adressDefault',
        redirect: 'all'

      },
      {
        path: 'all',
        name: 'all',
        component: require('./components/all.vue').default,

      },
      {
        path: 'form',
        name: 'form',
        component: require('./components/form.vue').default,

      }
    ]
  },
 ]


// 2- 创建router实例
let router = new Router({
  routes
})

// 根组件注入 vue实例化
let member = new Vue({
  el: '#member',
  //4- 别忘了注入router
  router,
})