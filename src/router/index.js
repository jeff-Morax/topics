import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ProductsView from "@/views/ProductListView.vue";
import AdminProductView from "@/views/AdminProductView.vue";
import MemberLoginView from "@/views/Memberloginview.vue";
import RegisterComponent from "@/views/RegisterView.vue"; // 確保註冊頁面的路由被引入

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/products",
    name: "products",
    component: ProductsView,
  },
  {
    path: "/admin/products",
    name: "admin-products",
    component: AdminProductView,
    meta: { requiresAdmin: true },
  },
  {
    path: "/login",
    name: "login",
    component: MemberLoginView,
  },
  {
    path: "/register", // 新增註冊路由
    name: "register",
    component: RegisterComponent,
  },
  {
    path: "/product/:id",
    name: "product-detail",
    component: () => import("@/views/ProductDetailView.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/CartView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 導航守衛，檢查是否已登入
router.beforeEach((to, from, next) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  if (
    to.meta.requiresAdmin &&
    (!loggedInUser || loggedInUser.role !== "admin")
  ) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
