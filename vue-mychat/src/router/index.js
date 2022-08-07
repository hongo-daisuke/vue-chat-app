import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatBoardView from '../views/ChatBoardView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import RoomListView from '../views/RoomListView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'RoomListView',
    component: RoomListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'ChatBoardView',
    component: ChatBoardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'SignUpView',
    component: SignUpView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// ログインチェックを行う
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    const user = sessionStorage.getItem('user')
    if (!user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})



export default router
