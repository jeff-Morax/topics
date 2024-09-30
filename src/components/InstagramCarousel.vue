<template>
  <div class="carousel-wrapper">
    <div class="carousel-container">
      <div
        v-for="(post, index) in instagramPosts"
        :key="index"
        :class="['carousel-item', { active: index === currentIndex }]"
        :style="{ transform: getCardStyle(index), zIndex: getZIndex(index) }"
      >
        <iframe
          :src="`https://www.instagram.com/p/${post}/embed`"
          class="instagram-embed"
          allowtransparency="true"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
    </div>
    <div class="carousel-controls">
      <button @click="prevSlide" class="control-btn control-left">‹</button>
      <button @click="nextSlide" class="control-btn control-right">›</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      instagramPosts: [
        "C-AKs37Pd2s", // Instagram 貼文的 ID
        "C9E7zyhvwCJ",
        "C7WNorNvcQn",
      ],
      currentIndex: 0,
    };
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.instagramPosts.length;
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.instagramPosts.length) %
        this.instagramPosts.length;
    },
    getCardStyle(index) {
      const offset = index - this.currentIndex;
      if (offset === 0) {
        return `translateX(0) scale(1)`; // 當前卡片
      } else if (offset > 0) {
        return `translateX(${offset * 100}%) scale(0.8)`; // 右側卡片
      } else {
        return `translateX(${offset * 100}%) scale(0.8)`; // 左側卡片
      }
    },
    getZIndex(index) {
      return index === this.currentIndex ? 10 : 1; // 當前卡片在最上層
    },
  },
  mounted() {
    this.autoPlay = setInterval(this.nextSlide, 5000); // 自動輪播
  },
  beforeUnmount() {
    clearInterval(this.autoPlay);
  },
};
</script>

<style scoped>
.carousel-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30rem; /* 固定寬度 */
  height: 30rem; /* 固定高度，讓卡片為正方形 */
  position: relative;
}

.carousel-item {
  position: absolute;
  transition: transform 0.5s ease, z-index 0.5s ease; /* 平滑過渡效果 */
  width: 100%;
  height: 100%;
}

.instagram-embed {
  width: 100%;
  height: 100%;
  border-radius: 1rem; /* 圓角設計 */
}

.carousel-controls {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  width: 5rem;
}

.control-btn {
  background-color: #333;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%; /* 圓形按鈕 */
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-btn:hover {
  background-color: #555;
}

/* RWD 設置 */
@media (max-width: 768px) {
  .carousel-container {
    width: 100%;
    height: auto; /* 自動調整寬高比例 */
  }

  .instagram-embed {
    height: auto;
  }

  .control-btn {
    width: 2.5rem; /* 縮小按鈕 */
    height: 2.5rem;
  }
}
</style>
