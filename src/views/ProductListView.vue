<template>
  <div id="home">
    <!-- 引入並使用 HeaderComponent -->
    <HeaderComponent />

    <h1>所有產品</h1>
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="'/assets/' + product.image" alt="Product Image" />
        <h2>{{ product.product_name }}</h2>
        <p>{{ product.price }} 元</p>
        <button @click="viewProduct(product.id)">查看詳情</button>
      </div>
    </div>

    <!-- 引入並使用 FooterComponent -->
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "ProductsView",
  components: {
    HeaderComponent,
    FooterComponent, // 確保註冊 FooterComponent
  },
  data() {
    return {
      products: [], // 初始化產品數據
    };
  },
  mounted() {
    this.fetchProducts(); // 頁面掛載時請求產品資料
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch("http://localhost:4000/api/products"); // 請求所有產品的 API
        this.products = await response.json(); // 將 API 返回的產品資料賦值給 products
      } catch (error) {
        console.error("無法獲取產品資料：", error); // 錯誤處理
      }
    },
    viewProduct(id) {
      this.$router.push(`/product/${id}`); // 點擊 "查看詳情" 按鈕時導航到產品詳情頁
    },
  },
};
</script>

<style scoped>
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.product-card {
  border: 1px solid #ccc;
  padding: 1rem;
  width: 200px;
  text-align: center;
}

.product-card img {
  max-width: 100%;
  height: auto;
}
</style>
