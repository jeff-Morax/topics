<template>
  <footer class="footer">
    <div class="footer-columns">
      <div class="footer-column">
        <h4>INFORMATIONS</h4>
        <p>Login</p>
        <p>購物指南</p>
        <p>退換貨政策</p>
        <p>隱私權政策</p>
        <p>服務條款</p>
      </div>
      <div class="footer-column">
        <h4>SERVICE</h4>
        <p>11:30 - 20:00(MON.-SON.)</p>
        <p>台中市北屯路8-6號</p>
        <p>first.fruits050229@gmail.com</p>
      </div>
      <div class="footer-column">
        <h4>FOLLOW US</h4>
        <div class="social-icons">
          <!--
  <img src="@/assets/facebook-icon.png" alt="Facebook" class="social-icon" />
  <img src="@/assets/instagram-icon.png" alt="Instagram" class="social-icon" />
  <img src="@/assets/twitter-icon.png" alt="Twitter" class="social-icon" />
  -->
          <span>Facebook Icon</span>
          <span>Instagram Icon</span>
          <span>Line Icon</span>
        </div>
      </div>
    </div>
    <p>&copy; 2024 你的網站名稱</p>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
.footer {
  background-color: #f8f8f8;
  color: black;
  text-align: center;
  padding: 1rem 0;
  position: relative;
  width: 100%;
}

.footer-columns {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-bottom: 1rem;
}

.follow-us {
  display: flex;
  flex-direction: column; /* 使圖標直列排列 */
  align-items: center;
}

/* 社交圖標設置 */
.social-icons {
  display: flex;
  flex-direction: column; /* 使社交媒體圖標或文字垂直排列 */
  gap: 0.5rem; /* 設置圖標之間的間距 */
}

/* RWD 支援 */
@media (max-width: 768px) {
  .footer-columns {
    flex-direction: column; /* 小螢幕下切換為垂直佈局 */
    gap: 1rem;
  }
}
</style>
