module.exports = {
  devServer: {
    proxy: {
      "/ws": {
        target: "ws://localhost:4000", // WebSocket 的代理地址
        ws: true, // 啟用 WebSocket 代理
        changeOrigin: true,
      },
    },
  },
};
