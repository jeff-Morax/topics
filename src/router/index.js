import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import MemberLoginView from "@/views/Memberloginview.vue"; // 登入頁
import RegisterComponent from "@/views/RegisterComponent.vue"; // 註冊頁
import ProductListView from "@/views/ProductListView.vue"; // 產品列表頁
import ProductDetailView from "@/views/ProductDetailView.vue"; // 單一產品詳情頁
import AdminProductView from "@/views/AdminProductView.vue"; // 後台產品管理頁
import NotFound from "@/views/NotFound.vue"; // 404頁面

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Memberlogin",
    component: MemberLoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterComponent,
  },
  {
    path: "/products", // 產品列表頁
    name: "ProductList",
    component: ProductListView,
  },
  {
    path: "/products/:id", // 單一產品詳情頁，動態路由
    name: "ProductDetail",
    component: ProductDetailView,
    props: true, // 允許 props 傳遞，方便在 ProductDetailView 中獲取產品 ID
  },
  {
    path: "/admin/products", // 後台產品管理頁
    name: "AdminProducts",
    component: AdminProductView,
    meta: { requiresAdmin: true }, // 需要管理員權限
  },
  {
    path: "/:catchAll(.*)", // 404頁面
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 將在這裡添加導航守衛，檢查是否具有管理員權限
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("user"); // 檢查是否登入
  const user = isLoggedIn ? JSON.parse(isLoggedIn) : null;

  // 如果路由需要管理員權限且當前用戶不是管理員，則重定向到登入頁面
  if (to.meta.requiresAdmin && (!user || user.role !== "admin")) {
    next({ name: "Memberlogin" });
  } else {
    next(); // 否則繼續導航
  }
});

export default router;
