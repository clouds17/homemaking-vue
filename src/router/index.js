import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import ALogin from '../components/admin/Login'
import AIndex from '../components/admin/Index'
import AWelcome from '../components/admin/Welcome'
import AConsumer from '../components/admin/user/Consumer'
import AAdministration from '../components/admin/user/Administration'
import ABabySitter from '../components/admin/baby-sitter/babySitter'
import AOrders from '../components/admin/orders/orders'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/admin/login', component: ALogin },
    {
      path: '/admin/index',
      component: AIndex,
      redirect: '/admin/welcome',
      children: [
        { path: '/admin/welcome', component: AWelcome },
        { path: '/admin/consumer', component: AConsumer },
        { path: '/admin/Administration', component: AAdministration },
        { path: '/admin/babySitter', component: ABabySitter },
        { path: '/admin/order', component: AOrders }
      ]
    }
  ]
})

export default router
