const express = require('express');
const cors = require('cors');
const userService = require('../user-service.js');
const jwt = require('jsonwebtoken');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://assignment3-frontend-gamma.vercel.app'],
  credentials: true
}));

app.use(express.json());

// Register endpoint
app.post('/api/user/register', async (req, res) => {
  try {
    await userService.connect();
    userService.registerUser(req.body)
      .then((msg) => {
        res.status(200).json({ "message": msg });
      }).catch((msg) => {
        res.status(422).json({ "message": msg });
      });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/user/login', async (req, res) => {
  try {
    await userService.connect();
    userService.checkUser(req.body)
      .then((user) => {
        let payload = {
          _id: user._id,
          userName: user.userName,
        };
        
        let token = jwt.sign(payload, process.env.JWT_SECRET);
        
        res.json({ message: "login successful", token: token });
      }).catch(msg => {
        res.status(422).json({ message: msg });
      });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Favourites endpoints
app.get('/api/user/favourites', async (req, res) => {
  try {
    await userService.connect();
    // Mock user ID for now
    const mockUserId = "64a1b2c3d4e5f6789012345";
    
    userService.getFavourites(mockUserId)
      .then(data => {
        res.json(data);
      }).catch(msg => {
        res.status(422).json({ error: msg });
      });
  } catch (error) {
    console.error('Favourites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/favourites/:id', async (req, res) => {
  try {
    await userService.connect();
    const mockUserId = "64a1b2c3d4e5f6789012345";
    const id = req.params.id;
    
    userService.addFavourite(mockUserId, id)
      .then(data => {
        res.json(data);
      }).catch(msg => {
        res.status(422).json({ error: msg });
      });
  } catch (error) {
    console.error('Add favourite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/user/favourites/:id', async (req, res) => {
  try {
    await userService.connect();
    const mockUserId = "64a1b2c3d4e5f6789012345";
    const id = req.params.id;
    
    userService.removeFavourite(mockUserId, id)
      .then(data => {
        res.json(data);
      }).catch(msg => {
        res.status(422).json({ error: msg });
      });
  } catch (error) {
    console.error('Remove favourite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
