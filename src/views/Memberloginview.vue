<template>
  <div>
    <!-- 插入 HeaderComponent -->
    <HeaderComponent />

    <!-- 會員登入區塊 -->
    <div class="login-container">
      <h1>會員登入頁面</h1>

      <!-- 會員帳號輸入框 -->
      <div class="form-group">
        <label for="email">會員帳號</label>
        <input
          type="text"
          id="email"
          v-model="email"
          placeholder="請輸入會員帳號"
        />
      </div>

      <!-- 會員密碼輸入框 -->
      <div class="form-group">
        <label for="password">會員密碼</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="請輸入會員密碼"
        />
      </div>

      <!-- 登入按鈕 -->
      <button class="login-btn" @click="login">登入</button>

      <!-- 忘記密碼與註冊會員 -->
      <div class="login-links">
        <a href="#" class="forgot-password">忘記密碼?</a>
        <a href="#" class="register" @click="goToRegister">註冊會員</a>
      </div>

      <!-- Google 登入按鈕 -->
      <div class="google-login">
        <button class="google-btn" @click="loginWithGoogle">
          <img
            src="@/assets/google-icon.png"
            alt="Google Icon"
            class="google-icon"
          />
          使用 Google 登入
        </button>
      </div>
    </div>

    <!-- 插入 FooterComponent -->
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "MemberLoginView",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("http://localhost:4000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // 儲存用戶數據到 localStorage
          localStorage.setItem("user", JSON.stringify(data));

          if (data.role === "admin") {
            this.$router.push("/admin/products");
          } else {
            this.$router.push("/products");
          }
        } else {
          alert("登入失敗，請檢查帳號或密碼");
        }
      } catch (error) {
        console.error("登入錯誤：", error);
        alert("登入錯誤，請稍後重試");
      }
    },
    async loginWithGoogle() {
      try {
        const googleUser = await this.getGoogleToken();
        const id_token = googleUser.getAuthResponse().id_token;

        const response = await fetch("http://localhost:4000/api/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: id_token }),
        });

        if (response.ok) {
          const data = await response.json();

          // 儲存用戶數據到 localStorage
          localStorage.setItem("user", JSON.stringify(data));

          if (data.role === "admin") {
            this.$router.push("/admin/products");
          } else {
            this.$router.push("/products");
          }
        } else {
          alert("Google 登入失敗");
        }
      } catch (error) {
        console.error("Google 登入錯誤：", error);
        alert("Google 登入錯誤");
      }
    },
    getGoogleToken() {
      return new Promise((resolve, reject) => {
        if (window.gapi && window.gapi.auth2) {
          window.gapi.auth2.getAuthInstance().signIn().then(resolve, reject);
        } else {
          reject(new Error("Google API 尚未加載"));
        }
      });
    },
    goToRegister() {
      this.$router.push("/register");
    },
  },
  mounted() {
    if (!window.gapi) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.onload = () => {
        window.gapi.load("auth2", () => {
          window.gapi.auth2.init({
            client_id:
              "578077334950-nqpm6kasi4m7nc80apuua603erfi3c2o.apps.googleusercontent.com",
          });
        });
      };
      document.head.appendChild(script);
    }
  },
};
</script>

<style scoped>
/* RWD 支援與 Header、Footer 上下 10rem 空間 */
.login-container {
  max-width: 400px;
  margin: 10rem auto;
  padding: 2rem;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 標題樣式 */
h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

/* 表單樣式 */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

/* 登入按鈕 */
.login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.login-btn:hover {
  background-color: #45a049;
}

/* 忘記密碼和註冊會員的鏈接樣式 */
.login-links {
  margin-top: 1rem;
  text-align: center;
}

.login-links a {
  color: #007bff;
  text-decoration: none;
  margin: 0 0.5rem;
}

.login-links a:hover {
  text-decoration: underline;
}

/* Google 登入按鈕樣式 */
.google-login {
  margin-top: 2rem;
  text-align: center;
}

.google-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.google-btn:hover {
  background-color: #357ae8;
}

/* RWD 支援 */
@media (max-width: 768px) {
  .login-container {
    margin: 5rem auto; /* 小螢幕上將上下間距縮小 */
    padding: 1.5rem;
  }
}
</style>
