import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import welcome from '@/components/Welcome'

Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect:'/home'},
    { path: '/login', component: Login },
    { 
      path: '/home', component: Home ,redirect:'/welcome',
      children:[
        {path:'/welcome',component:welcome}
      ]
      }
  ]
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
