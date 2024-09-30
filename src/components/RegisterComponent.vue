<template>
  <div class="register-container">
    <h2>註冊新會員</h2>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">密碼</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmPassword">確認密碼</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <button type="submit">註冊</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    register() {
      if (this.password !== this.confirmPassword) {
        alert("密碼與確認密碼不符！");
        return;
      }
      // 在這裡處理註冊邏輯，例如發送 API 請求
      console.log("會員註冊中...", this.email, this.password);
    },
  },
};
</script>

<style scoped>
.register-container {
  width: 300px;
  margin: auto;
  padding: 2rem;
  background-color: #f8f8f8;
  border-radius: 5px;
}
</style>
