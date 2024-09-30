// 引入所需的套件
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer"); // 引入 multer 處理圖片上傳
const path = require("path");
const { OAuth2Client } = require("google-auth-library");

const app = express();

// CORS 設置，允許自定義 header：userId
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "userId"], // 設置 userId 可通過 header 傳遞
  })
);

app.use(express.json());

// 設置 multer 用來處理圖片上傳
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 設置上傳圖片的存儲路徑
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 使用當前時間戳來生成文件名
  },
});
const upload = multer({ storage });

// MySQL 連接
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

// 驗證用戶是否為管理員
const checkAdmin = (req, res, next) => {
  const userId = req.headers["userid"]; // 直接從 headers 中獲取 userId

  if (!userId) {
    console.error("缺少用戶ID");
    return res.status(403).json({ message: "缺少用戶ID" });
  }

  const query = "SELECT role FROM users WHERE id = ?";
  connection.query(query, [userId], (err, results) => {
    if (err || results.length === 0) {
      console.error("無法確認用戶角色");
      return res.status(403).json({ message: "無法確認用戶角色" });
    }

    const userRole = results[0].role;
    if (userRole === "admin") {
      next(); // 如果是管理員，允許繼續執行
    } else {
      console.error("僅管理員可以執行此操作");
      res.status(403).json({ message: "僅管理員可以執行此操作" });
    }
  });
};

// 新增產品 API，支持圖片上傳，僅限管理員
app.post("/api/products", checkAdmin, upload.single("image"), (req, res) => {
  const { product_name, description, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null; // 獲取圖片文件名

  const query =
    "INSERT INTO products (product_name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [product_name, description, price, quantity, image],
    (err, results) => {
      if (err) {
        console.error("資料庫錯誤:", err);
        return res.status(500).send("資料庫錯誤");
      }
      res.status(201).json({ message: "產品新增成功" });
    }
  );
});

// 查詢產品列表 API
app.get("/api/products", (req, res) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("資料庫錯誤:", err);
      return res.status(500).send("資料庫錯誤");
    }
    res.json(results);
  });
});

// 刪除產品 API，僅限管理員
app.delete("/api/products/:id", checkAdmin, (req, res) => {
  const productId = req.params.id;
  const query = "DELETE FROM products WHERE id = ?";
  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error("刪除產品失敗:", err);
      return res.status(500).send("刪除產品失敗");
    }
    res.status(200).json({ message: "產品刪除成功" });
  });
});

// 更新產品 API，僅限管理員
app.put("/api/products/:id", checkAdmin, upload.single("image"), (req, res) => {
  const productId = req.params.id;
  const { product_name, description, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null; // 可選圖片上傳

  const query =
    "UPDATE products SET product_name = ?, description = ?, price = ?, quantity = ?, image = COALESCE(?, image) WHERE id = ?";
  connection.query(
    query,
    [product_name, description, price, quantity, image, productId],
    (err, results) => {
      if (err) {
        console.error("更新產品失敗:", err);
        return res.status(500).send("更新產品失敗");
      }
      res.status(200).json({ message: "產品更新成功" });
    }
  );
});

// 登錄 API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send("無法找到該用戶");
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        res
          .status(200)
          .json({ message: "登錄成功", userId: user.id, role: user.role });
      } else {
        res.status(401).send("密碼錯誤");
      }
    });
  });
});

// 讓靜態文件可被訪問 (圖片)
app.use("/uploads", express.static("uploads"));

// 啟動伺服器
const port = 4000;

app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 運行`);
});
