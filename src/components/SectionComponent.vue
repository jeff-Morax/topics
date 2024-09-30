<template>
  <div class="main-content">
    <div class="product">
      <img
        src="@/assets/first-fruit-1.png"
        alt="Product 1"
        class="product-img"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "MainComponent",
};
</script>

<style scoped>
.main-content {
  flex-basis: 70%; /* 佔據 70% 的寬度 */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem; /* 產品之間的間距 */
}

.product-img {
  width: 100%;
  max-width: 25rem; /* 最大寬度為 15rem */
  height: auto; /* 保持圖片比例 */
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column; /* 小螢幕下垂直排列 */
    align-items: center;
  }

  .product-img {
    max-width: 100%; /* 小螢幕下圖片佔滿寬度 */
  }
}
</style>
