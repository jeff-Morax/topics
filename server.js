const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const ecpay_payment = require("ecpay_aio_nodejs");
const app = express();

// 讓靜態文件可被訪問 (圖片)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 設置 CORS，允許所有來源
app.use(
  cors({
    origin: "*", // 允許來自任何來源的請求
    methods: ["GET", "POST", "PUT", "DELETE"], // 允許的 HTTP 方法
    allowedHeaders: ["Content-Type", "Authorization", "userId"], // 允許的 headers
  })
);

app.use(express.json()); // 解析 JSON 請求

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

// 設置 Google OAuth2 客戶端
const client = new OAuth2Client(
  "578077334950-nqpm6kasi4m7nc80apuua603erfi3c2o.apps.googleusercontent.com"
);

// 登入 API
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

// 註冊 API
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  // 檢查 email 是否已存在
  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "資料庫錯誤" });
    if (results.length > 0) {
      return res.status(400).json({ message: "該帳號已經存在" });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新增用戶到資料庫
    const insertQuery =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')";
    connection.query(
      insertQuery,
      [username, email, hashedPassword],
      (err, results) => {
        if (err) return res.status(500).json({ message: "註冊失敗" });
        res.status(201).json({ message: "註冊成功", user: { username } });
      }
    );
  });
});

// Google 登入 API
app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "578077334950-nqpm6kasi4m7nc80apuua603erfi3c2o.apps.googleusercontent.com", // Google 客戶端 ID
    });
    const payload = ticket.getPayload();

    const email = payload["email"];
    const username = payload["name"];

    // 在資料庫中查找用戶
    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "資料庫錯誤" });
      }

      if (results.length > 0) {
        // 如果用戶已經存在
        res.status(200).json({
          message: "登入成功",
          userId: results[0].id,
          role: results[0].role,
        });
      } else {
        // 新增用戶
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

// 啟動伺服器
const port = 4000;
app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 運行`);
});

app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products"; // 請根據資料庫結構調整
  connection.query(query, (err, results) => {
    if (err) {
      console.error("資料庫錯誤:", err);
      return res.status(500).send("資料庫錯誤");
    }
    res.json(results); // 返回產品資料
  });
});

// Multer 配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // 確保有 uploads 目錄
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 生成唯一文件名
  },
});
const upload = multer({ storage }); // 只定義一次 upload

// 新增產品 API
app.post("/api/products", upload.single("image"), (req, res) => {
  const { product_name, description, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  const query =
    "INSERT INTO products (product_name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [product_name, description, price, quantity, image],
    (err, results) => {
      if (err) {
        console.error("新增產品失敗:", err);
        return res.status(500).send("資料庫錯誤");
      }
      res.status(201).json({ message: "產品新增成功" });
    }
  );
});

// 更新產品 API 路由以處理圖片上傳
app.put("/api/products/:id", upload.single("image"), (req, res) => {
  const { product_name, description, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  const query =
    "UPDATE products SET product_name = ?, description = ?, price = ?, quantity = ?, image = COALESCE(?, image) WHERE id = ?";
  connection.query(
    query,
    [product_name, description, price, quantity, image, req.params.id],
    (err, results) => {
      if (err) {
        console.error("更新產品失敗:", err);
        return res.status(500).send("資料庫錯誤");
      }
      res.status(200).json({ message: "產品更新成功" });
    }
  );
});

// 刪除產品 API
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const userId = req.headers.userid; // 從 headers 中取得 userId

  // 檢查用戶是否為管理員
  const checkAdminQuery = "SELECT role FROM users WHERE id = ?";
  connection.query(checkAdminQuery, [userId], (err, results) => {
    if (err || results.length === 0 || results[0].role !== "admin") {
      return res.status(403).json({ message: "無法刪除產品，您不是管理員" });
    }

    // 刪除產品
    const deleteProductQuery = "DELETE FROM products WHERE id = ?";
    connection.query(deleteProductQuery, [productId], (err, results) => {
      if (err) {
        console.error("刪除產品失敗:", err);
        return res.status(500).send("無法刪除產品");
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "產品不存在" });
      }
      res.status(200).json({ message: "產品刪除成功" });
    });
  });
});

app.get("/api/product/:id", (req, res) => {
  const productId = req.params.id;

  // 查詢產品資料
  const query = "SELECT * FROM products WHERE id = ?";
  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error("查詢產品失敗:", err);
      return res.status(500).send("資料庫錯誤");
    }
    if (results.length === 0) {
      return res.status(404).send("找不到產品");
    }

    const product = results[0];

    // 查詢加購項目（如果有的話）
    const addonsQuery = "SELECT * FROM addons WHERE product_id = ?";
    connection.query(addonsQuery, [productId], (err, addonResults) => {
      if (err) {
        console.error("查詢加購項目失敗:", err);
        return res.status(500).send("資料庫錯誤");
      }

      res.json({ product, addons: addonResults });
    });
  });
});

// 購物車 API
app.post("/api/cart", (req, res) => {
  const { userId, productId, quantity, addons } = req.body;

  const query = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
  `;

  connection.query(query, [userId, productId, quantity], (err, results) => {
    if (err) {
      console.error("購物車更新失敗:", err);
      return res.status(500).send("購物車更新失敗");
    }

    // 處理加價購的邏輯 (根據需要擴展)
    if (addons && addons.length > 0) {
      const addonQuery = `
        INSERT INTO cart_addons (cart_id, addon_id)
        VALUES ?
      `;
      const addonValues = addons.map((addonId) => [results.insertId, addonId]);

      connection.query(addonQuery, [addonValues], (addonErr) => {
        if (addonErr) {
          console.error("加價購更新失敗:", addonErr);
          return res.status(500).send("加價購更新失敗");
        }
        res.status(200).json({ message: "購物車更新成功" });
      });
    } else {
      res.status(200).json({ message: "購物車更新成功" });
    }
  });
});

app.use(cors());
app.use(express.json());

app.get("/api/cartItems", (req, res) => {
  const userId = req.headers.userid;

  const query = `
    SELECT c.product_id, p.name, p.price, c.quantity
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("無法獲取購物車內容：", err);
      return res.status(500).send("無法獲取購物車內容");
    }

    res.status(200).json(results);
  });
});

// 取得使用者購物車資料的 API
app.get("/api/cart/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT products.id, products.product_name AS name, products.price, cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("無法獲取購物車資料:", err);
      return res.status(500).json({ message: "購物車資料錯誤" });
    }

    // 確保回傳的是一個 JSON 格式
    res.json(results);
  });
});

// 刪除購物車中的品項 API
app.delete("/api/cart/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;

  const query = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
  connection.query(query, [userId, productId], (err, results) => {
    if (err) {
      console.error("移除購物車品項失敗:", err);
      return res.status(500).send("移除購物車品項失敗");
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "購物車中無此品項" });
    }

    res.status(200).json({ message: "購物車品項已移除" });
  });
});

const options = {
  OperationMode: "Test", // 測試環境，上線時改為 'Production'
  MercProfile: {
    MerchantID: "你的商店代號", // 請替換成你的綠界商店代號
    HashKey: "你的HashKey", // 替換為你的HashKey
    HashIV: "你的HashIV", // 替換為你的HashIV
  },
};

// 綠界結帳 API
app.post("/api/checkout", (req, res) => {
  const { cart, total } = req.body;

  const base_param = {
    MerchantTradeNo: `TRADE_NO_${Date.now()}`, // 交易編號，必須是唯一的
    MerchantTradeDate: new Date().toISOString().slice(0, 19).replace("T", " "), // 當前日期與時間
    TotalAmount: total.toString(), // 訂單金額
    TradeDesc: "商品交易描述", // 交易描述
    ItemName: cart.map((item) => `${item.name} x ${item.quantity}`).join("#"), // 將購物車內商品名稱與數量串接
    ReturnURL: "https://yourdomain.com/ecpay_return", // 綠界通知付款結果的回傳網址
    ClientBackURL: "https://yourdomain.com/order", // 付款完成後跳轉的網址
    OrderResultURL: "https://yourdomain.com/ecpay_result", // 用於顯示交易結果的網址
    NeedExtraPaidInfo: "N", // 不需要額外付款資訊
  };

  const options = {
    OperationMode: "Test", // 測試環境，上線時改為 'Production'
    MercProfile: {
      MerchantID: "你的商店代號", // 測試商店代號
      HashKey: "你的HashKey", // 測試 HashKey
      HashIV: "你的HashIV", // 測試 HashIV
    },
  };

  const ecpay = new ecpay_payment(options);

  // 生成付款網址
  const paymentForm = ecpay.payment_client.aio_check_out_all(base_param);

  // 返回綠界的付款頁面網址
  res.json({ paymentUrl: paymentForm });
});

// 綠界的回傳 API 處理
app.post("/ecpay_return", (req, res) => {
  console.log("ECPay Return:", req.body); // 處理綠界的付款狀態通知
  res.status(200).send("OK"); // 回覆綠界已接收
});
