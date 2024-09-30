<template>
  <div id="admin">
    <HeaderComponent />
    <h1>管理產品</h1>
    <div class="product-form">
      <input v-model="product_name" placeholder="產品名稱" />
      <textarea v-model="description" placeholder="產品描述"></textarea>
      <input v-model="price" placeholder="價格" type="number" />
      <input v-model="quantity" placeholder="數量" type="number" />

      <!-- 文件選擇框和圖片預覽 -->
      <input type="file" @change="onFileChange" />
      <img v-if="imageUrl" :src="imageUrl" alt="選擇的圖片" />

      <!-- 更換圖片按鈕 -->
      <button v-if="image" @click="resetImage">更換圖片</button>

      <button @click="addProduct">新增產品</button>
    </div>

    <h2>現有產品</h2>
    <ul>
      <li v-for="product in products" :key="product.id">
        <img
          v-if="product.image"
          :src="'http://localhost:4000/uploads/' + product.image"
          alt="Product Image"
        />
        {{ product.product_name }} - {{ product.price }} 元
        <button @click="deleteProduct(product.id)">刪除</button>
        <button @click="editProduct(product)">編輯</button>
      </li>
    </ul>
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "AdminProductView",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      products: [],
      product_name: "",
      description: "",
      price: 0,
      quantity: 0,
      image: null,
      imageUrl: null, // 保存選擇的圖片 URL 用於預覽
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.image = file;
        this.imageUrl = URL.createObjectURL(file); // 生成圖片預覽
      }
    },
    resetImage() {
      this.image = null;
      this.imageUrl = null;
      this.$refs.fileInput.value = ""; // 清除文件選擇框的值
    },
    async fetchProducts() {
      try {
        const response = await fetch("http://localhost:4000/api/products");
        this.products = await response.json();
      } catch (error) {
        console.error("無法獲取產品資料：", error);
      }
    },
    async addProduct() {
      const formData = new FormData();
      formData.append("product_name", this.product_name);
      formData.append("description", this.description);
      formData.append("price", this.price);
      formData.append("quantity", this.quantity);
      if (this.image) {
        formData.append("image", this.image); // 如果有圖片，則加入到表單中
      }

      const user = JSON.parse(localStorage.getItem("user"));

      try {
        const response = await fetch("http://localhost:4000/api/products", {
          method: "POST",
          body: formData,
          headers: {
            userid: user.userId, // 傳遞 userId 在 headers 中
          },
        });

        if (response.ok) {
          this.fetchProducts(); // 重新獲取產品列表
          this.resetForm(); // 清空表單
        } else {
          console.error("新增產品失敗");
        }
      } catch (error) {
        console.error("無法新增產品：", error);
      }
    },

    resetForm() {
      this.product_name = "";
      this.description = "";
      this.price = 0;
      this.quantity = 0;
      this.image = null;
      this.imageUrl = null;
    },
    async deleteProduct(id) {
      const user = JSON.parse(localStorage.getItem("user"));

      try {
        await fetch(`http://localhost:4000/api/products/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.userId }),
        });
        this.fetchProducts();
      } catch (error) {
        console.error("無法刪除產品：", error);
      }
    },
    editProduct(product) {
      this.product_name = product.product_name;
      this.description = product.description;
      this.price = product.price;
      this.quantity = product.quantity;
    },
  },
};
</script>

<style scoped>
.product-form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
  gap: 1rem;
}

ul {
  list-style-type: none;
}

ul li {
  margin: 0.5rem 0;
}
</style>
