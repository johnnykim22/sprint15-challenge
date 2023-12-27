const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./model'); // Replace with your actual path to the model
const saltRounds = 8;
const secret = process.env.JWT_SECRET || "shh"; // Ensure you have JWT_SECRET in your environment variables

// Helper function to generate a token
function generateToken(user) {
  const payload = {
    subject: user.id, // subject is typically the user ID
    username: user.username
  };
  const options = {
    expiresIn: '1h', // token valid for 1 hour
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
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await Users.add({ username, password: hash });
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password // It's typically not recommended to send the password hash back
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
    const user = await Users.findBy({ username }).first(); // Use 'first()' if expecting one record
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
