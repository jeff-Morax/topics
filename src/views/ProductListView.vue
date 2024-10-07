<template>
  <div id="home">
    <HeaderComponent />
    <h1>所有產品</h1>
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img
          v-if="product.image"
          :src="'http://localhost:4000/uploads/' + product.image"
          alt="Product Image"
          class="product-image"
        />
        <h2>{{ product.product_name }}</h2>
        <p>{{ product.price }} 元</p>
        <button @click="viewProduct(product.id)">查看詳情</button>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch("http://localhost:4000/api/products");
        this.products = await response.json();
      } catch (error) {
        console.error("無法獲取產品資料：", error);
      }
    },
    viewProduct(id) {
      this.$router.push(`/product/${id}`); // 導向單個產品頁
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
.product-image {
  max-width: 150px; /* 根據需要調整寬度 */
  height: auto; /* 確保圖片比例正確 */
  object-fit: cover; /* 確保圖片以適當的方式裁切 */
}
</style>
