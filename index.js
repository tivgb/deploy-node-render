const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer"); // For handling file uploads

const app = express();
const PORT = 3000;
const dataFilePath = path.join(__dirname, "data.json");

// Enable CORS for all requests
app.use(cors());
app.use(express.json()); // Middleware to parse JSON body
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded form data

// Multer setup for handling form-data (file uploads)
const upload = multer({ dest: "uploads/" }); // Stores uploaded files in 'uploads/' folder

// Read JSON file
const readData = () => {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write JSON file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test API Route
app.get("/testing-api", (req, res) => {
    res.json({
        success: 1,
        status: 200,
        message: "Hello World!",
    });
});

// 🟢 Create Data (POST) - Supports JSON, Form-data & URL-encoded
app.post("/api/create/items", upload.single("file"), (req, res) => {
    const { title, ...rest } = req.body;

    if (!title) {
        return res.status(400).json({ success: 0, status: 400, message: "Title is required " });
    }

    const items = readData();
    const newItem = { 
        id: items.length ? items[items.length - 1].id + 1 : 1, 
        title, 
        ...rest,
        createdAt: new Date().toISOString(), // Add creation timestamp
        updatedAt: new Date().toISOString()  // Add modification timestamp
    };

    items.push(newItem);
    writeData(items);

    res.status(201).json({ success: 1, status: 201, message: "Item created", item: newItem });
});

// 🔵 Read All Data (GET)
app.get("/api/items", (req, res) => {
    res.json({
        success: 1,
        status: 200,
        data: readData(),
    });
});

// 🟡 Read Single Item (GET by ID)
app.get("/api/items/:id", (req, res) => {
    const items = readData();
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ success: 0, status: 404, message: "Item not found" });
    res.json({ success: 1, status: 200, item });
});

// 🟠 Update Data (PUT)
app.put("/api/update/items/:id", upload.single("file"), (req, res) => {
    const { title, ...rest } = req.body;

    if (!title) {
        return res.status(400).json({ success: 0, status: 400, message: "Title is required to update" });
    }

    let items = readData();
    const index = items.findIndex(i => i.id === parseInt(req.params.id));

    if (index === -1) return res.status(404).json({ success: 0, status: 404, message: "Item not found" });

    const updatedItem = { 
        ...items[index], 
        title, // Ensure title is updated
        ...rest,
        updatedAt: new Date().toISOString() // Update modification timestamp
    };

    items[index] = updatedItem;

    writeData(items);
    res.json({ success: 1, status: 200, message: "Item updated", item: updatedItem });
});

// 🔴 Delete Data (DELETE)
app.delete("/api/delete/items/:id", (req, res) => {
    let items = readData();
    const newItems = items.filter(i => i.id !== parseInt(req.params.id));

    if (items.length === newItems.length) return res.status(404).json({ success: 0, status: 404, message: "Item not found" });

    writeData(newItems);
    res.json({ success: 1, status: 200, message: "Item deleted" });
});

// 🟣 User Authentication 
app.get("/api/me", (req, res) => {
  if (!req.user) {
      return res.status(401).json({
          success: 0,
          status: 401,
          message: "Guest user",
          user: null
      });
  }

  res.json({
      success: 1,
      status: 200,
      user: req.user
  });
});

// Catch-all route for 404 Not Found
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "layouts", "404.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
