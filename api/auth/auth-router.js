const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./model'); // Make sure this path is correct

// bcryptjs recommends a value of 12 for most secure hashes
const saltRounds = 8;
const secret =  "shh"; // Fallback in case the environment variable is not set

// Helper function to generate a token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, secret, options);
}

// Helper function to check if user input is valid
function isValid(user) {
  return Boolean(user.username && user.password && typeof user.password === "string");
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!isValid(req.body)) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    console.log(saltRounds)
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await Users.createUser(username, hash);
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password // This should be omitted in production for security reasons
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      res.status(409).json({ message: "username taken" });
    } else {
      res.status(500).json({ message: "Error registering new user" });
    }
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!isValid(req.body)) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    const user = await Users.findByUsername(username);
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: `welcome, ${user.username}`, token });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
