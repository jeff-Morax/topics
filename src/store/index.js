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
    removeProductFromCart({ commit }, productId) {
      commit("removeFromCart", productId);
    },
    clearCartItems({ commit }) {
      commit("clearCart");
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
