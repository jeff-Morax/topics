<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/工具列_compressed.jpg" alt="Logo" class="logo-img" />
    </div>
    <div class="nav-icons">
      <!-- 會員按鈕 -->
      <img
        v-if="!loggedInUser"
        src="@/assets/button1.png"
        alt="Member"
        class="icon-btn"
        @click="goToLogin"
      />
      <button v-if="loggedInUser" @click="logout">登出</button>

      <!-- 購物車按鈕 -->
      <img
        src="@/assets/button2.png"
        alt="Cart"
        class="icon-btn"
        @click="goToCart"
      />

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
      loggedInUser: null,
    };
  },
  mounted() {
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));
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
    goToLogin() {
      this.$router.push({ name: "login" });
    },
    logout() {
      localStorage.removeItem("user");
      this.loggedInUser = null;
      this.$router.push({ name: "home" });
    },
    goToCart() {
      const user = JSON.parse(localStorage.getItem("user"));
      this.$router.push({ name: "cart", params: { userId: user.userId } });
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
  z-index: 10;
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
  margin-top: 1rem;
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

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 5px;
  z-index: 10000;
  width: 200px;
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
}

.dropdown-menu li {
  padding: 0.5rem 0;
}

.dropdown-menu a {
  text-decoration: none;
  color: #333;
  display: block;
  text-align: center;
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

@media (min-width: 768px) {
  .header {
    flex-direction: row;
  }

  .nav-icons {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
