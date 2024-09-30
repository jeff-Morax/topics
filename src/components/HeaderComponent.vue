<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/工具列_compressed.jpg" alt="Logo" class="logo-img" />
    </div>
    <div class="nav-icons">
      <!-- 會員按鈕 -->
      <img
        src="@/assets/button1.png"
        alt="Member"
        class="icon-btn"
        @click="goToHome"
      />

      <!-- 購物車按鈕 -->
      <img src="@/assets/button2.png" alt="Cart" class="icon-btn" />

      <!-- 漢堡選單 -->
      <div class="hamburger-menu">
        <span @click="toggleMenu" class="hamburger-icon">≡</span>
        <nav v-if="isMenuOpen" class="dropdown-menu">
          <ul>
            <li><a href="#">首頁</a></li>
            <li><a href="#">購物指南</a></li>
            <li @click="toggleDropdown">九月品項 ▼</li>
            <ul v-if="isDropdownOpen" class="sub-menu">
              <li><a href="#">鮮奶油蛋糕</a></li>
              <li><a href="#">巴斯克乳酪蛋糕</a></li>
              <li><a href="#">其他甜點</a></li>
            </ul>
            <li><a href="#">關於我們</a></li>
            <li><a href="#">常見問題</a></li>
            <li><a href="#">聯絡我們</a></li>
            <br />
            <button class="login-btn" @click="goToHome">會員登入</button>
            <button class="register-btn">註冊新會員</button>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
      isDropdownOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if (!this.isMenuOpen) {
        this.isDropdownOpen = false;
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    goToHome() {
      this.$router.push({ name: "Memberlogin" }); // 使用路由名稱進行跳轉
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center; /* 讓Logo居中 */
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f8f8;
  position: relative;
  flex-direction: column; /* 預設垂直排列，確保在小螢幕下圖標在logo下方 */
  z-index: 10; /* 設置 header 的 z-index */
}

.logo {
  text-align: center;
}

.logo-img {
  max-width: 150px;
  height: auto;
}

/* nav-icons 在桌面模式中水平排列，保持RWD */
.nav-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem; /* 默認在 logo 下方，桌面模式可根據需求調整 */
}

.icon-btn {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.hamburger-menu {
  position: relative;
}

.hamburger-icon {
  font-size: 30px;
  cursor: pointer;
}

/* 漢堡選單，確保 z-index 設置較大，讓它顯示在畫面最上層 */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 5px;
  z-index: 10000; /* 設置較大的 z-index，確保選單顯示在最上層 */
  width: 200px; /* 固定下拉選單的寬度 */
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
}

.dropdown-menu li {
  padding: 0.5rem 0;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.dropdown-menu a {
  text-decoration: none;
  color: #333;
  display: block;
  text-align: center;
}

/* 加入hover效果，當滑鼠懸停時背景變成草綠色 */
.dropdown-menu li:hover {
  background-color: #dfdfc5; /* 草綠色背景 */
  color: white;
}

.sub-menu {
  padding-left: 1.5rem;
}

.login-btn,
.register-btn {
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #ececdc;
  border: none;
  cursor: pointer;
}

.login-btn:hover,
.register-btn:hover {
  background-color: #dfdfdf;
}

/* RWD 支援 */
@media (min-width: 768px) {
  .header {
    flex-direction: row; /* 在桌面上Logo和圖標水平排列 */
  }

  .nav-icons {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
