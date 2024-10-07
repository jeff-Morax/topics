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
            username: this.username,
            email: this.email,
            password: this.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          alert(`註冊成功，歡迎 ${data.user.username}！`);
          this.$router.push("/login");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "註冊失敗，請稍後重試");
        }
      } catch (error) {
        console.error("註冊錯誤：", error);
        alert("註冊錯誤，請稍後重試");
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
          localStorage.setItem("user", JSON.stringify(data));
          this.$router.push("/products");
        } else {
          alert("Google 登入失敗");
        }
      } catch (error) {
        if (error.error === "popup_closed_by_user") {
          alert("Google 登入彈窗已被關閉，請再試一次");
        } else {
          console.error("Google 登入錯誤：", error);
          alert("Google 登入錯誤，請稍後重試");
        }
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
  },
  mounted() {
    if (!window.gapi) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.onload = () => {
        window.gapi.load("auth2", () => {
          window.gapi.auth2
            .init({
              client_id:
                "578077334950-nqpm6kasi4m7nc80apuua603erfi3c2o.apps.googleusercontent.com",
            })
            .then(() => {
              console.log("Google Auth Initialized");
            })
            .catch((error) => {
              console.error("Google Auth Initialization Error:", error);
            });
        });
      };
      document.head.appendChild(script);
    }
  },
};
</script>

<style scoped>
/* 樣式調整 */
.register-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.google-login {
  margin-top: 1rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}
</style>
