const express = require("express");
const cors = require("cors");
const userService = require("../user-service.js");
const jwt = require("jsonwebtoken");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://assignment3-frontend-gamma.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Test database endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    await userService.connect();
    res.json({
      status: "OK",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Register endpoint
app.post("/api/user/register", async (req, res) => {
  try {
    console.log("Register request received:", req.body);

    // Connect to database for each request (serverless friendly)
    await userService.connect();
    console.log("Database connected");

    userService
      .registerUser(req.body)
      .then((msg) => {
        console.log("Registration successful:", msg);
        res.status(200).json({ message: msg });
      })
      .catch((msg) => {
        console.error("Registration failed:", msg);
        res.status(422).json({ message: msg });
      });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Login endpoint
app.post("/api/user/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    await userService.connect();
    console.log("Database connected for login");

    userService
      .checkUser(req.body)
      .then((user) => {
        console.log("Login successful for user:", user.userName);
        let payload = {
          _id: user._id,
          userName: user.userName,
        };

        let token = jwt.sign(payload, process.env.JWT_SECRET);

        res.json({ message: "login successful", token: token });
      })
      .catch((msg) => {
        console.error("Login failed:", msg);
        res.status(422).json({ message: msg });
      });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Favourites endpoints
app.get("/api/user/favourites", async (req, res) => {
  try {
    await userService.connect();
    const mockUserId = "64a1b2c3d4e5f6789012345";

    userService
      .getFavourites(mockUserId)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } catch (error) {
    console.error("Favourites error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.put("/api/user/favourites/:id", async (req, res) => {
  try {
    await userService.connect();
    const mockUserId = "64a1b2c3d4e5f6789012345";
    const id = req.params.id;

    userService
      .addFavourite(mockUserId, id)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } catch (error) {
    console.error("Add favourite error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.delete("/api/user/favourites/:id", async (req, res) => {
  try {
    await userService.connect();
    const mockUserId = "64a1b2c3d4e5f6789012345";
    const id = req.params.id;

    userService
      .removeFavourite(mockUserId, id)
      .then((data) => {
        res.json(data);
      })
      .catch((msg) => {
        res.status(422).json({ error: msg });
      });
  } catch (error) {
    console.error("Remove favourite error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

module.exports = app;
