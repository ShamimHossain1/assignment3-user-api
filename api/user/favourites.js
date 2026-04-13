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

    // Mock user for now - in real implementation, you'd verify JWT
    const mockUserId = "64a1b2c3d4e5f6789012345"; // This should come from JWT verification

    if (req.method === "GET") {
      userService
        .getFavourites(mockUserId)
        .then((data) => {
          res.json(data);
        })
        .catch((msg) => {
          res.status(422).json({ error: msg });
        });
    } else if (req.method === "PUT") {
      const id = req.query.id;
      userService
        .addFavourite(mockUserId, id)
        .then((data) => {
          res.json(data);
        })
        .catch((msg) => {
          res.status(422).json({ error: msg });
        });
    } else if (req.method === "DELETE") {
      const id = req.query.id;
      userService
        .removeFavourite(mockUserId, id)
        .then((data) => {
          res.json(data);
        })
        .catch((msg) => {
          res.status(422).json({ error: msg });
        });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Favourites error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
