<template>
  <div>
    <HeaderComponent />
    <div class="login-container">
      <h1>會員登入頁面</h1>

      <div class="form-group">
        <label for="email">會員帳號</label>
        <input
          type="text"
          id="email"
          v-model="email"
          placeholder="請輸入會員帳號"
        />
      </div>

      <div class="form-group">
        <label for="password">會員密碼</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="請輸入會員密碼"
        />
      </div>

      <button class="login-btn" @click="login">登入</button>

      <!-- 註冊按鈕 -->
      <div class="register-container">
        <p>還沒有帳號？</p>

        <button class="register-btn" @click="$router.push('/register')">
          註冊新會員
        </button>
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

    goToRegister() {
      this.$router.push("/register"); // 導向註冊頁面
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
              "578077334950-nqpm6kasi4m7nc80apuua603erfi3c2o.apps.googleusercontent.com", // 正確的Google Client ID
          });
        });
      };
      document.head.appendChild(script);
    }
  },
};
</script>

<style scoped>
/* 登入頁面樣式 */
.login-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

.register-container {
  margin-top: 1rem;
  text-align: center;
}

.register-btn {
  background-color: #007bff;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.register-btn:hover {
  background-color: #0056b3;
}
</style>
