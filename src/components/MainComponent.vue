<template>
  <div class="main-content">
    <div class="carousel">
      <!-- 從 API 加載的圖片 -->
      <img :src="currentImageUrl" alt="Carousel Image" class="carousel-img" />

      <!-- 插入的覆蓋圖片，大小設置為 350px，向上移動約 3rem -->
      <img
        src="@/assets/first-fruit-2.png"
        alt="Overlay Image"
        class="overlay-img"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MainComponent",
  data() {
    return {
      images: [], // 存儲從 API 獲取的圖片 URL
      currentIndex: 0,
      carouselInterval: null,
    };
  },
  computed: {
    currentImageUrl() {
      // 返回當前 API 加載的圖片
      return this.images.length ? this.images[this.currentIndex] : null;
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://34.168.66.212:5000/v1/pro");
        const productData = response.data.data;

        // 完整的圖片 URL
        this.images = productData.map(
          (product) => `http://34.168.66.212/${product["圖片位置"]}`
        );

        if (!this.images.length) {
          console.error("圖片資料為空或格式不正確");
        }
      } catch (error) {
        console.error("抓取圖片資料時發生錯誤:", error);
      }
    },
    startCarousel() {
      this.carouselInterval = setInterval(() => {
        // 每5秒切換到下一張圖片
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }, 5000);
    },
    stopCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
      }
    },
  },
  mounted() {
    this.fetchData(); // 初始化抓取圖片
    this.startCarousel(); // 啟動輪播
  },
  beforeUnmount() {
    this.stopCarousel(); // 組件卸載時停止輪播
  },
};
</script>

<style scoped>
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative; /* 必須讓容器相對定位，便於子元素絕對定位 */
}

.carousel {
  max-width: 600px;
  width: 85%;
  text-align: center;
  position: relative; /* 必須讓圖片容器相對定位，便於圖片疊加 */
}

.carousel-img {
  width: 100%; /* 圖片寬度佔滿容器 */
  height: auto;
  position: relative;
  z-index: 1; /* 從 API 加載的圖片位於後面 */
}

.overlay-img {
  position: absolute;
  top: -3rem; /* 向上移動約 3rem */
  left: -3rem; /* 向左移動約 3rem */
  width: 350px; /* 設置覆蓋圖片寬度為 350px */
  height: auto; /* 保持圖片比例 */
  z-index: 2; /* 覆蓋圖片位於前面 */
}

/* RWD 支援 */
@media (max-width: 1024px) {
  .carousel {
    max-width: 80%; /* 螢幕較小時縮小輪播區塊寬度 */
  }

  .overlay-img {
    width: 300px; /* 縮小覆蓋圖片的大小 */
    top: -2rem; /* 向上移動略微調整 */
    left: -2rem; /* 向左移動略微調整 */
  }
}

@media (max-width: 768px) {
  .carousel {
    max-width: 70%; /* 小螢幕時進一步縮小輪播區塊寬度 */
  }

  .overlay-img {
    width: 250px; /* 小螢幕時覆蓋圖片進一步縮小 */
    top: -1.5rem; /* 調整位置 */
    left: -1.5rem;
  }
}

@media (max-width: 480px) {
  .carousel {
    max-width: 90%; /* 非常小螢幕時輪播區塊填滿大部分螢幕 */
  }

  .overlay-img {
    width: 200px; /* 非常小螢幕時覆蓋圖片縮小 */
    top: -1rem; /* 調整位置 */
    left: -1rem;
  }
}
</style>
