<template>
  <div class="login-container">
    <h2>會員登入</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">密碼</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">登入</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      // 在這裡處理登入邏輯，例如發送 API 請求
      console.log("會員登入中...", this.email, this.password);
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 300px;
  margin: auto;
  padding: 2rem;
  background-color: #f8f8f8;
  border-radius: 5px;
}
</style>
