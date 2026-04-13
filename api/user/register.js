const userService = require("../../user-service.js");

// CORS middleware
const corsMiddleware = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", [
    "http://localhost:3000",
    "https://assignment3-frontend-gamma.vercel.app",
  ]);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
};

module.exports = async (req, res) => {
  try {
    // Apply CORS
    await new Promise((resolve, reject) => {
      corsMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    await userService.connect();

    if (req.method === "POST") {
      userService
        .registerUser(req.body)
        .then((msg) => {
          res.status(200).json({ message: msg });
        })
        .catch((msg) => {
          res.status(422).json({ message: msg });
        });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
