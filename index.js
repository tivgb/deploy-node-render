const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Enable CORS for all requests
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/testing-api", (req, res) => {
  res.json({
    success: 1,
    status: 200,
    message: "Hello World!",
  });
});

// Catch-all route for 404 Not Found
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "layouts", "404.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
