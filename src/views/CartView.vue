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
  computed: {
    cartItems() {
      return this.$store.getters.cartItems;
    },
    cartTotal() {
      return this.$store.getters.cartTotal;
    },
  },
  methods: {
    removeFromCart(productId) {
      this.$store.dispatch("removeProductFromCart", productId);
    },
    checkout() {
      // 進行結帳邏輯，例如跳轉到綠界支付頁面
      console.log("前往結帳");
    },
  },
};
</script>
