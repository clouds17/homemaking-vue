import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import ALogin from '../components/admin/Login'
import AIndex from '../components/admin/Index'
import AWelcome from '../components/admin/Welcome'
import AConsumer from '../components/admin/user/Consumer'
import AAdministration from '../components/admin/user/Administration'

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
        { path: '/admin/Administration', component: AAdministration }
      ]
    }
  ]
})

export default router
