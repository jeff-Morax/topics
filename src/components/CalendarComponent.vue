<template>
  <div class="image-container">
    <!-- 顯示圖片，寬度為 50rem -->
    <img src="@/assets/10月-02.jpg" alt="October Image" />
  </div>
</template>

<script>
export default {
  name: "CalendarComponent",
};
</script>

<style scoped>
.image-container {
  text-align: center; /* 圖片居中對齊 */
}

.image-container img {
  width: 50rem; /* 設定圖片寬度為 50rem */
  height: auto; /* 保持圖片比例 */
}

/* RWD 支援 */
@media (max-width: 768px) {
  .image-container img {
    width: 90%; /* 小螢幕時圖片寬度縮小 */
  }
}
</style>
