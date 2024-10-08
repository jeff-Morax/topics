<template>
  <div>
    <h2>購物車清單</h2>
    <ul v-if="cartItems.length > 0">
      <li v-for="item in cartItems" :key="item.id">
        {{ item.name }} - {{ item.quantity }} x ${{ item.price }}
        <button @click="removeFromCart(item.id)">移除</button>
      </li>
    </ul>
    <p v-else>您的購物車目前是空的。</p>

    <p>總價: ${{ cartTotal }}</p>

    <button v-if="cartItems.length > 0" @click="checkout">前往結帳</button>
  </div>
</template>

<script>
export default {
  props: ["userId"], // 接收從路由傳來的 userId
  computed: {
    cartItems() {
      return this.$store.getters.cartItems;
    },
    cartTotal() {
      return this.$store.getters.cartTotal;
    },
  },
  mounted() {
    // 在元件掛載後根據 userId 獲取購物車資料
    this.$store.dispatch("fetchCartItems", this.userId);
  },
  methods: {
    removeFromCart(productId) {
      this.$store.dispatch("removeProductFromCart", productId);
    },
    checkout() {
      console.log("前往結帳");
    },
  },
};
</script>
