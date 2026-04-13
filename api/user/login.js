const userService = require("../../user-service.js");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    await userService.connect();
    
    if (req.method === 'POST') {
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
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
