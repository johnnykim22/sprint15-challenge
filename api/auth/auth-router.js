const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./model'); // Assuming this is your user model with methods to interact with the database

const saltRounds = 8;
const secret = process.env.JWT_SECRET || "shh"; // Ensure you have JWT_SECRET in your environment variables


// Helper function to generate a token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const options = {
    expiresIn: '1h', // token valid for 1 hour
  };

  return jwt.sign(payload, secret, options);
}

// Helper function to check if a user is valid
function isValid(user) {
  return Boolean(user.username && user.password && typeof user.password === "string");
}

/* */

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    const hash = bcrypt.hashSync(password, saltRounds); // Synchronous hashing can be used inside an async function
    const newUser = await Users.add({ username, password: hash }); // Assuming 'add' is a method to insert a user into the DB
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      res.status(409).json({ message: "username taken" });
    } else {
      res.status(500).json({ message: "Error registering new user" });
    }
  }
});

  

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});


  //compare method
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */


      router.post('/login', (req, res) => {
        const { username, password } = req.body;
      
        if (!isValid(req.body)) {
          return res.status(400).json({ message: "username and password required" });
        }
      
        Users.findBy({ username }) // Make sure findBy is implemented to retrieve a user by username
          .then(([user]) => {
            if (user && bcrypt.compareSync(password, user.password)) {
              const token = generateToken(user);
              res.status(200).json({ message: `welcome, ${user.username}`, token });
            } else {
              res.status(401).json({ message: "invalid credentials" });
            }
          })
          .catch(error => {
            res.status(500).json({ message: "Error logging in" });
          });
      });
      
      module.exports = router;