const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({
    success: 1,
    status: 200,
    message: "Hello World!",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
