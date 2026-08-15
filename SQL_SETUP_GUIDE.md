# Hướng dẫn chuyển từ JSON sang SQL

## 📁 Cấu trúc folder mới

```
Backend/
├── config/              # Cấu hình database
│   └── database.js      # Cấu hình connection
├── database/            # Quản lý database
│   └── connection.js    # Tạo pool connection
├── models/              # Data models (Query logic)
│   ├── Card.js         # Model Card - tất cả queries cho cards
│   └── User.js         # Model User - tất cả queries cho users
├── routes/              # API routes
│   ├── cards.js        # Endpoints: GET /api/cards, POST, PUT, DELETE
│   └── users.js        # Endpoints: GET /api/users, POST, PUT, DELETE
├── migrations/          # Database schema
│   └── init.sql        # SQL script để tạo tables
├── utils/               # Utilities
│   └── logger.js       # Logging functions
└── server.js           # Main server file (cần update)
```

## 🚀 Các bước để integrate SQL

### 1. Cài đặt mysql2 package
```bash
npm install mysql2
npm install dotenv
```

### 2. Tạo file .env (copy từ .env.example)
```bash
cp .env.example .env
```

Sau đó chỉnh sửa thông tin database của bạn:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=yugioh_shop
```

### 3. Tạo database và tables
Chạy script SQL trong MySQL:
```bash
mysql -u root -p < migrations/init.sql
```

Hoặc login MySQL và chạy:
```sql
\. migrations/init.sql
```

### 4. Update server.js
Thay thế các phần JSON file logic bằng routes:

```javascript
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config();

const { initializePool } = require('./database/connection');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cards', cardsRouter);
app.use('/api/users', usersRouter);

// Initialize database
(async () => {
  try {
    await initializePool();
    server.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
```

### 5. Cách sử dụng Models
```javascript
// Lấy tất cả cards
const cards = await Card.findAll();

// Lấy card theo ID
const card = await Card.findById(1);

// Tạo card mới
await Card.create({
  name: "Blue Eyes White Dragon",
  type: "Monster",
  attack: 3000,
  defense: 2500,
  price: 50.00
});

// Cập nhật card
await Card.update(1, {
  name: "Updated Name",
  price: 60.00
});

// Xóa card
await Card.delete(1);
```

## 📝 Thao tác thường dùng

### Thêm cột mới vào table
Chỉnh sửa file SQL trong `migrations/` và chạy lại

### Thêm model mới
1. Tạo file mới trong folder `models/`
2. Copy logic từ `Card.js` hoặc `User.js`
3. Thay đổi tên class và queries

### Thêm route mới
1. Tạo file mới trong folder `routes/`
2. Import model tương ứng
3. Thêm router vào `server.js`

## 🔒 Bảo mật
- Không commit `.env` file
- Sử dụng `.env.example` để mô tả cấu trúc
- Không lưu password dưới dạng plain text (nên dùng hash)

## 🐛 Debugging
Set `DEBUG=true` trong `.env` để xem thêm log messages
