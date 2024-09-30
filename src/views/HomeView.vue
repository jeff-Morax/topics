<template>
  <div id="home">
    <HeaderComponent />

    <!-- 這裡是 Section 和 MainComponent 並排顯示的區塊 -->
    <div class="content-layout">
      <SectionComponent />
      <MainComponent />
    </div>

    <!-- CarouselComponent 單獨出來的區塊 -->
    <div class="carousel-layout">
      <CarouselComponent />
    </div>

    <!-- ProductGridComponent 插入到頁面中 -->
    <div class="product-grid-layout">
      <ProductGridComponent />
    </div>

    <!-- CalendarComponent 插入到頁面中 -->
    <div class="calendar-layout">
      <CalendarComponent />
    </div>

    <!-- Instagram 貼文輪播區塊 -->
    <div class="instagram-carousel-layout">
      <InstagramCarousel />
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import SectionComponent from "@/components/SectionComponent.vue";
import MainComponent from "@/components/MainComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import CarouselComponent from "@/components/CarouselComponent.vue";
import ProductGridComponent from "@/components/ProductGridComponent.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import InstagramCarousel from "@/components/InstagramCarousel.vue"; // 引入 InstagramCarousel

export default {
  components: {
    HeaderComponent,
    SectionComponent,
    MainComponent,
    FooterComponent,
    CarouselComponent,
    ProductGridComponent,
    CalendarComponent,
    InstagramCarousel, // 註冊 InstagramCarousel
  },
  data() {
    return {
      ws: null, // WebSocket 連接
      messages: [], // 儲存從 WebSocket 接收到的消息
    };
  },
  methods: {
    // 初始化 WebSocket 連接
    initWebSocket() {
      this.ws = new WebSocket("ws://localhost:4000/ws");

      this.ws.onopen = () => {
        console.log("Connected to WebSocket server");
        this.ws.send("Hello Server!"); // 向伺服器發送消息
      };

      this.ws.onmessage = (event) => {
        console.log("Message from server:", event.data);
      };

      this.ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };
    },
    // 當應用卸載時關閉 WebSocket 連接
    closeWebSocket() {
      if (this.ws) {
        this.ws.close();
      }
    },
  },
  mounted() {
    this.initWebSocket(); // 初始化 WebSocket 連接
  },
  beforeUnmount() {
    this.closeWebSocket(); // 關閉 WebSocket 連接
  },
};
</script>

<style>
/* 設置背景圖片 */
#app {
  background-image: url("@/assets/背景.jpg"); /* 背景圖片路徑 */
  background-size: cover; /* 背景圖片覆蓋整個頁面 */
  background-position: top; /* 背景圖片從頂部顯示 */
  background-repeat: no-repeat; /* 防止背景重複 */
  min-height: 100vh; /* 確保背景圖片覆蓋整個瀏覽器視窗 */
}

/* 設置主要佈局 */
.content-layout {
  display: flex;
  justify-content: space-between; /* 讓SectionComponent和MainComponent並排 */
  padding: 2rem;
  gap: 1rem; /* 兩個區塊之間的間距 */
}

/* CarouselComponent 獨立的樣式 */
.carousel-layout {
  margin-top: 2rem; /* CarouselComponent 與上面的區塊保持間距 */
  padding: 2rem;
  text-align: center; /* 讓 CarouselComponent 居中對齊 */
}

/* ProductGridComponent 獨立的樣式 */
.product-grid-layout {
  margin-top: 2rem;
  padding: 2rem;
  text-align: center; /* 讓 ProductGridComponent 居中對齊 */
}

/* CalendarComponent 獨立的樣式 */
.calendar-layout {
  margin-top: 2rem;
  padding: 2rem;
  text-align: center; /* 讓 CalendarComponent 居中對齊 */
}

/* Instagram 貼文輪播的樣式 */
.instagram-carousel-layout {
  margin-top: 2rem;
  padding: 2rem;
  text-align: center; /* 讓 InstagramCarousel 居中對齊 */
}

@media (max-width: 768px) {
  .content-layout {
    flex-direction: column; /* 小螢幕下切換為垂直佈局 */
    padding: 1rem;
  }

  .carousel-layout,
  .product-grid-layout,
  .calendar-layout,
  .instagram-carousel-layout {
    padding: 1rem;
  }
}
</style>
