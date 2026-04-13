const userService = require("../../user-service.js");

module.exports = async (req, res) => {
  try {
    await userService.connect();
    
    if (req.method === 'POST') {
      userService.registerUser(req.body)
        .then((msg) => {
          res.status(200).json({ "message": msg });
        }).catch((msg) => {
          res.status(422).json({ "message": msg });
        });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
