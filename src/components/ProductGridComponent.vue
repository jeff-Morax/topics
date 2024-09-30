<template>
  <div class="product-grid-container">
    <div class="product-grid">
      <!-- 迴圈顯示產品圖片 -->
      <div
        v-for="product in visibleProducts"
        :key="product.編號"
        class="product-item"
      >
        <img
          :src="`http://34.168.66.212/${product['圖片位置']}`"
          :alt="product.productName"
          class="product-img"
        />
        <p>{{ product.productName }}</p>
      </div>
    </div>
    <!-- 無論圖片數量，按鈕都會顯示 -->
    <button
      v-if="showMoreButton"
      @click="loadMoreProducts"
      class="load-more-btn"
    >
      瀏覽全部
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [], // 保存 API 獲取的所有產品數據
      visibleProducts: [], // 當前顯示的產品列表
      productsPerLoad: 3, // 初始顯示的產品數量改為 3
      showMoreButton: true, // 顯示 "瀏覽全部" 按鈕
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://34.168.66.212:5000/v1/pro");
        this.products = response.data.data.slice(4, 10); // 獲取指定的產品範圍
        this.loadMoreProducts(); // 加載初始產品
      } catch (error) {
        console.error("抓取產品數據時發生錯誤:", error);
      }
    },
    loadMoreProducts() {
      const start = this.visibleProducts.length;
      const end = start + this.productsPerLoad;
      this.visibleProducts = [
        ...this.visibleProducts,
        ...this.products.slice(start, end),
      ];
      // 如果已顯示所有產品，則隱藏按鈕
      if (this.visibleProducts.length >= this.products.length) {
        this.showMoreButton = false;
      }
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.product-grid-container {
  text-align: center;
  margin: 2rem 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 15rem); /* 預設為3列，每列寬度為15rem */
  grid-gap: 3rem; /* 圖片之間的間距為3rem */
  justify-content: center; /* 圖片居中 */
}

.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-img {
  width: 15rem; /* 將圖片寬度設置為 15rem */
  height: auto;
}

.load-more-btn {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.load-more-btn:hover {
  background-color: #218838;
}

/* RWD 支援 */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(2, 15rem); /* 中等螢幕顯示2列 */
    grid-gap: 2rem; /* 中等螢幕的間距縮小 */
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(1, 15rem); /* 小螢幕顯示1列 */
    grid-gap: 1.5rem; /* 小螢幕的間距縮小 */
  }

  .product-img {
    width: 12rem; /* 小螢幕圖片縮小 */
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(1, 12rem); /* 非常小螢幕顯示1列 */
    grid-gap: 1rem; /* 非常小螢幕的間距縮小 */
  }

  .product-img {
    width: 10rem; /* 非常小螢幕圖片進一步縮小 */
  }
}
</style>
