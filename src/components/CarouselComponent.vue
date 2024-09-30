<template>
  <div class="carousel-container">
    <div class="side-images">
      <!-- 分別設置 main_1 和 main_2 的寬度 -->
      <img src="@/assets/main_1.jpg" alt="Main Image 1" class="main-img-1" />
      <img src="@/assets/main_2.jpg" alt="Main Image 2" class="main-img-2" />
    </div>
    <div class="carousel-content">
      <!-- 插入輪播圖片 -->
      <div class="carousel">
        <img :src="currentImageUrl" alt="Carousel Image" class="carousel-img" />
      </div>
      <!-- 插入 tv.png 圖片，並覆蓋在輪播圖片上方 -->
      <img src="@/assets/tv.png" alt="TV Image" class="tv-img" />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CarouselComponent",
  data() {
    return {
      images: [],
      currentIndex: 0,
      carouselInterval: null,
    };
  },
  computed: {
    currentImageUrl() {
      // 返回當前輪播圖片 URL
      return this.images.length ? this.images[this.currentIndex] : null;
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://34.168.66.212:5000/v1/pro");
        const productData = response.data.data;

        // 提取需要的圖片位置
        const relevantImages = productData
          .slice(4, 10)
          .map((product) => `http://34.168.66.212/${product["圖片位置"]}`);

        this.images = relevantImages;

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
.carousel-container {
  display: flex; /* 使用 Flex 讓圖片和輪播區塊並排 */
  align-items: flex-start;
  justify-content: space-between; /* 讓圖片和內容分布在左右 */
  gap: 1rem; /* 圖片與輪播區之間的間距 */
  width: 100%;
  position: relative; /* 為容器設置相對定位，以便絕對定位的元素可以參照它 */
}

.side-images {
  display: flex;
  flex-direction: column; /* 垂直排列圖片 */
}

.main-img-1 {
  width: 15rem; /* 將 main_1.jpg 的寬度設置為 15rem */
  height: auto; /* 保持圖片比例 */
  margin-bottom: 1rem; /* 圖片之間的間距 */
}

.main-img-2 {
  width: 10rem; /* 將 main_2.jpg 的寬度設置為 10rem */
  height: auto; /* 保持圖片比例 */
}

.carousel-content {
  flex-grow: 1; /* 讓輪播區塊自動佔據剩餘空間 */
  text-align: center; /* 讓輪播圖片和 tv.png 水平居中對齊 */
  position: relative; /* 相對定位，讓內部元素使用絕對定位 */
}

.tv-img {
  position: absolute; /* 設置 tv.png 為絕對定位，覆蓋輪播區塊 */
  top: 0;
  right: 0;
  width: 80%; /* 使用百分比設置 tv.png 的寬度 */
  height: auto; /* 保持圖片比例 */
  z-index: 2; /* 確保 tv.png 覆蓋在輪播圖片上方 */
}

.carousel {
  position: relative;
  z-index: 1; /* 確保輪播圖片位於 tv.png 的下方 */
  margin-top: 1rem;
}

.carousel-img {
  width: 55%; /* 將輪播圖片的寬度設置為 33rem */
  height: auto;
  margin: 0 auto; /* 確保圖片水平居中 */
  position: relative;
  top: 2rem; /* 將圖片位置調整以與 tv.png 中心對齊 */
  left: 10px;
}

/* RWD 設置 */
@media (max-width: 1024px) {
  .carousel-container {
    flex-direction: column; /* 中等螢幕下切換為垂直佈局 */
    align-items: center;
  }

  .tv-img {
    width: 100%; /* 中等螢幕下調整 tv.png 的寬度 */
  }

  .carousel-img {
    width: 69%; /* 中等螢幕下圖片寬度縮小 */
    left: -10px;
  }
}

@media (max-width: 768px) {
  .tv-img {
    width: 100%; /* 小螢幕下進一步縮小 tv.png */
  }

  .carousel-img {
    width: 69%; /* 小螢幕下圖片佔滿寬度 */
    left: -10px;
  }
}

@media (max-width: 480px) {
  .tv-img {
    width: 100%; /* 非常小螢幕時進一步縮小 tv.png */
  }

  .carousel-img {
    width: 69%; /* 非常小螢幕時縮小圖片寬度 */
    left: -10px;
  }
}
</style>
