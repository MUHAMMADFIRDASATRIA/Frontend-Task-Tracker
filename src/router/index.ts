import { createRouter, createWebHistory } from "vue-router"
import LoginView from "@/views/LoginView.vue"

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
    meta: { guest: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/projects",
    name:"halo",
    component: () => import("@/views/ProjectView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/projects/create",
    name:"create-project",
    component: () => import("@/views/CreateProject.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/projects/:id/edit",
    name:"edit-project",
    component: () => import("@/views/EditProject.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/projects/:id",
    name:"tasks",
    component: () => import("@/views/TasksView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/projects/:id/tasks/create",
    name:"create-task",
    component: () => import("@/views/CreateTask.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/projects/:projectId/tasks/:taskId/edit",
    name:"edit-task",
    component: () => import("@/views/EditTask.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/profile",
    name:"profile",
    component: () => import("@/views/ProfileView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/workspace",
    name:"workspace",
    component: () => import("@/views/WorkspaceView.vue"),
    meta: { guest: true },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* =========================
   ROUTE GUARD
========================= */
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/'
  }

  if (to.meta.guest && token) {
    return '/dashboard'
  }
})

export default router