<template>
  <div id="home">
    <!-- 引入並使用 HeaderComponent -->
    <HeaderComponent />

    <!-- 產品詳情內容 -->
    <div class="product-detail">
      <img :src="'/assets/' + product.image" alt="Product Image" />
      <h1>{{ product.product_name }}</h1>
      <p>{{ product.description }}</p>
      <p>價格：{{ product.price }} 元</p>
      <p>數量：{{ product.quantity }}</p>
    </div>

    <!-- 引入並使用 FooterComponent -->
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "ProductDetail",
  components: {
    HeaderComponent,
    FooterComponent, // 確保註冊 FooterComponent
  },
  data() {
    return {
      product: {}, // 初始化 product 資料
    };
  },
  mounted() {
    this.fetchProduct();
  },
  methods: {
    async fetchProduct() {
      const id = this.$route.params.id; // 取得路由中的產品 ID
      try {
        const response = await fetch(
          `http://localhost:4000/api/products/${id}`
        );
        this.product = await response.json(); // 將返回的產品資料賦值給 product
      } catch (error) {
        console.error("無法獲取產品詳情：", error); // 處理錯誤
      }
    },
  },
};
</script>

<style scoped>
.product-detail {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.product-detail img {
  width: 100%;
  height: auto;
}
</style>
