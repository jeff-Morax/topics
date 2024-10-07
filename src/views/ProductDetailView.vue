<template>
  <div>
    <HeaderComponent />
    <div v-if="product">
      <h1>{{ product.product_name }}</h1>
      <img
        :src="'http://localhost:4000/uploads/' + product.image"
        alt="Product Image"
      />
      <p>{{ product.price }} 元</p>
      <p>{{ product.description }}</p>

      <label for="quantity">數量：</label>
      <input type="number" v-model="quantity" min="1" />

      <h3>加價購：</h3>
      <div v-for="addon in addons" :key="addon.id">
        <label>
          <input type="checkbox" v-model="selectedAddons" :value="addon.id" />
          {{ addon.name }} (+{{ addon.price }} 元)
        </label>
      </div>

      <button @click="addToCart">加入購物車</button>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      product: null,
      addons: [],
      quantity: 1,
      selectedAddons: [],
    };
  },
  async created() {
    const productId = this.$route.params.id; // 從 URL 中提取產品 ID
    try {
      const response = await fetch(
        `http://localhost:4000/api/product/${productId}`
      );
      const data = await response.json();
      this.product = data.product; // 設置產品數據
      this.addons = data.addons; // 如果有加購項目，則設置加購項目
    } catch (error) {
      console.error("無法獲取產品資料：", error);
    }
  },
  methods: {
    async addToCart() {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("http://localhost:4000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          productId: this.product.id,
          quantity: this.quantity,
          addons: this.selectedAddons,
        }),
      });

      if (response.ok) {
        alert("已成功加入購物車");
      } else {
        alert("加入購物車失敗");
      }
    },
  },
};
</script>
