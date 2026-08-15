const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

const CARDS_FILE = path.join(__dirname, "cards.json");
const USERS_FILE = path.join(__dirname, "users.json");

// Đọc dữ liệu thẻ bài
function getCards() {
  try {
    if (!fs.existsSync(CARDS_FILE)) return [];
    const data = fs.readFileSync(CARDS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Lỗi đọc file cards.json:", err.message);
    return [];
  }
}

function saveCards(cards) {
  fs.writeFileSync(CARDS_FILE, JSON.stringify(cards, null, 2), "utf8");
  // 🔔 Gửi tín hiệu báo cho TẤT CẢ các tab mở web cập nhật lại danh sách ngay lập tức!
  io.emit("cards_updated", cards);
}

// Đọc dữ liệu User
function getUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      const defaultUser = [
        {
          name: "Seto Kaiba (Admin)",
          username: "admin",
          password: "123",
          role: "admin",
        },
      ];
      fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(defaultUser, null, 2),
        "utf8",
      );
      return defaultUser;
    }
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Lỗi đọc file users.json:", err.message);
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

// --- API CARDS ---
app.get("/api/cards", (req, res) => res.json(getCards()));

app.post("/api/cards", (req, res) => {
  const cards = getCards();
  const newCard = { id: Date.now().toString(), ...req.body };
  cards.push(newCard);
  saveCards(cards);
  res.status(201).json(newCard);
});

app.put("/api/cards/:id", (req, res) => {
  const { id } = req.params;
  let cards = getCards();
  const index = cards.findIndex(
    (c) => (c._id ? c._id.toString() : c.id.toString()) === id.toString(),
  );

  if (index !== -1) {
    cards[index] = { ...cards[index], ...req.body };
    saveCards(cards);
    return res.json({ message: "Cập nhật thành công!", card: cards[index] });
  }
  res.status(404).json({ message: "Không tìm thấy lá bài này!" });
});

app.delete("/api/cards/:id", (req, res) => {
  const { id } = req.params;
  let cards = getCards();
  const newCards = cards.filter(
    (c) => (c._id ? c._id.toString() : c.id.toString()) !== id.toString(),
  );
  saveCards(newCards);
  res.json({ message: "Đã xóa lá bài thành công!" });
});

// --- API AUTH ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword });
  }
  return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu!" });
});

app.post("/api/register", (req, res) => {
  const { name, email, username, password } = req.body;
  const users = getUsers();

  if (users.some((u) => u.username === username)) {
    return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
  }

  const newUser = { name, email, username, password, role: "user" };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: "Đăng ký thành công!" });
});

// Phục vụ frontend tách riêng
const frontendDir = path.join(__dirname, "..", "Fontend");
app.use(express.static(frontendDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

// Socket.io kết nối
io.on("connection", (socket) => {
  console.log("⚡ Có thiết bị/tab vừa kết nối!");
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy thành công tại http://localhost:${PORT}`);
});
