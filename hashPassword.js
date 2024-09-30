// hashPassword.js
const bcrypt = require("bcrypt");

const plainPassword = "undead321"; // 你要加密的明文密碼
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
  if (err) {
    console.error("加密失敗：", err);
  } else {
    console.log("加密後的密碼：", hash);
  }
});
