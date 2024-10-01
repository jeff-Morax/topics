<template>
  <!-- 這裡是每個頁面會顯示的內容 -->
  <router-view />
</template>

<script>
export default {
  name: "App",

  mounted() {
    // 檢查使用者登入狀態，如果未登入則導向登入頁面
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user && this.$route.name !== "login") {
      this.$router.push({ name: "login" });
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fffcf6;
}
</style>
