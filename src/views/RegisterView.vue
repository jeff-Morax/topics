<template>
  <div>
    <HeaderComponent />

    <!-- 註冊頁面 -->
    <div class="register-container">
      <h1>註冊新會員</h1>

      <!-- 會員帳號 -->
      <div class="form-group">
        <label for="username">會員帳號</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="請輸入會員帳號"
        />
      </div>

      <!-- 電子郵件 -->
      <div class="form-group">
        <label for="email">電子郵件</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="請輸入電子郵件"
        />
      </div>

      <!-- 會員密碼 -->
      <div class="form-group">
        <label for="password">會員密碼</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="請輸入會員密碼"
        />
      </div>

      <!-- 註冊按鈕 -->
      <button class="register-btn" @click="register">註冊</button>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "RegisterComponent",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch("http://localhost:4000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username, // 傳遞 username
            email: this.email,
            password: this.password,
          }),
        });

        if (response.ok) {
          const data = await response.json(); // 獲取回傳的用戶資訊
          alert(`註冊成功，歡迎 ${data.user.username}！`);
          this.$router.push("/login"); // 成功後跳轉到登入頁面
        } else {
          const errorData = await response.json(); // 顯示具體錯誤訊息
          alert(errorData.message || "註冊失敗，請稍後重試");
        }
      } catch (error) {
        console.error("註冊錯誤：", error);
        alert("註冊錯誤，請稍後重試");
      }
    },
  },
};
</script>
