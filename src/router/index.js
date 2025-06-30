import { createRouter, createWebHistory } from "vue-router"
import store from "../stores"
import Home from "../views/Home.vue"
import About from "../views/About.vue"
import Login from "../components/Login.vue"
import Signup from "../components/Signup.vue"
import Dashboard from "../components/Dashboard.vue"
import Subscription from "../components/Subscription.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/subscription",
    name: "Subscription",
    component: Subscription,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guard
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next("/login")
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
