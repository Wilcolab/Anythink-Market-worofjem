const express = require('express');

const app = express();
const PORT = 8001;

// Middleware
app.use(express.json());

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
