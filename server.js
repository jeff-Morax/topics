const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");

const app = express();

// CORS 設置
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "userId"],
  })
);

app.use(express.json());

const connection = mysql.createConnection({
  host: "192.168.19.128",
  user: "jeff",
  password: "Jeff_050229",
  database: "membership",
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL 連接失敗:", err);
    return;
  }
  console.log("MySQL 已成功連接");
});

// 設置Google OAuth2 客戶端
const client = new OAuth2Client(
  "578077334950-nqpm6kasi4m7nc80apuua603erfi3c2o.apps.googleusercontent.com"
);

app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "578077334950-nqpm6kasi4m7nc80apuua603erfi3c2o.apps.googleusercontent.com", // 正確的Google Client ID
    });
    const payload = ticket.getPayload();

    const email = payload["email"];
    const username = payload["name"];

    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "資料庫錯誤" });
      }

      if (results.length > 0) {
        res.status(200).json({
          message: "登入成功",
          userId: results[0].id,
          role: results[0].role,
        });
      } else {
        const insertQuery =
          "INSERT INTO users (username, email, role) VALUES (?, ?, 'user')";
        connection.query(insertQuery, [username, email], (err, results) => {
          if (err) {
            return res.status(500).json({ message: "註冊失敗" });
          }
          res
            .status(201)
            .json({ message: "註冊成功", userId: results.insertId });
        });
      }
    });
  } catch (error) {
    console.error("Google 登入錯誤:", error);
    res.status(401).json({ message: "無效的 Google 令牌" });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 運行`);
});
