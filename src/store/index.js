import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      userId: null, // 保存全局的 userId
      cartItems: [], // 儲存購物車的商品
    };
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    addToCart(state, product) {
      const itemInCart = state.cartItems.find((item) => item.id === product.id);
      if (itemInCart) {
        // 如果產品已經在購物車中，增加數量
        itemInCart.quantity += product.quantity;
      } else {
        // 如果產品不在購物車中，新增一項
        state.cartItems.push(product);
      }
    },
    removeFromCart(state, productId) {
      state.cartItems = state.cartItems.filter((item) => item.id !== productId);
    },
    clearCart(state) {
      state.cartItems = [];
    },
  },
  actions: {
    updateUserId({ commit }, userId) {
      commit("setUserId", userId);
    },
    addProductToCart({ commit }, product) {
      commit("addToCart", product);
    },
    async removeProductFromCart({ commit, state }, productId) {
      const userId = state.userId;

      try {
        // 呼叫後端 API，從購物車中移除品項
        const response = await fetch(
          `http://localhost:4000/api/cart/${userId}/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          commit("removeFromCart", productId); // 如果移除成功，更新 Vuex 狀態
        } else {
          console.error("無法移除購物車品項");
        }
      } catch (error) {
        console.error("移除購物車品項錯誤：", error);
      }
    },
    clearCartItems({ commit }) {
      commit("clearCart");
    },
    fetchCartItems({ commit }, userId) {
      fetch(`http://localhost:4000/api/cart/${userId}`)
        .then((response) => response.json())
        .then((cartItems) => {
          cartItems.forEach((item) => {
            commit("addToCart", item);
          });
        })
        .catch((error) => {
          console.error("無法獲取購物車資料:", error);
        });
    },
  },
  getters: {
    getUserId: (state) => state.userId,
    cartItems: (state) => state.cartItems,
    cartTotal: (state) => {
      return state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
});

export default store;
