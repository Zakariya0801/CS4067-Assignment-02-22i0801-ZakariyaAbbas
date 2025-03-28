const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {pool} = require('../dbConfig');

// token verification

const protect = async (req, res) => {
    try {
      // Check if token exists in headers
      const token = req.header("Authorization")?.split(' ')[1] || '';
  
      if (!token) {
        return res
          .status(401)
          .json({ message: "No token, authorization denied" });
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Find user from token
      res.status(200).json({
        decoded
      });
      // pool.query(
      //   `SELECT * FROM users
      //   WHERE id = $1`, [decoded.userId], async (err,results) => {
      //       if(err){
      //           throw err;
      //       }
      //       console.log(results.rows)

      //       if(results.rows.length == 0){
      //           return res.status(401).json({ message: "Token is not valid" });
      //       }
      //       // Add user to request object
      //       const user = results.rows[0]; 
      //       res.status(200).json({
      //         user,
      //       })
      //   }
      // );
    } catch (error) {
      res.status(401).json({ message: "Token is not valid" });
    }
};

// sign Up
const signup = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        password2,
      } = req.body;
      console.log(req.body);
      // Validate input
      if (!name || !email || !password || !password2) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      console.log("hrererera")
      // Check if user exists
      const response  = await pool.query(
        `SELECT * FROM users
        WHERE email = $1`, [email], );

      if (response.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }
      console.log("doingggg htis")
      console.log("password = ", password )
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("doingggg htis")
      // Create user
      const resp = await pool.query(
        `INSERT INTO users(name,email,password)
         VALUES($1,$2,$3)
         RETURNING id,password`, [name,email,hashedPassword]);
        
      if (resp.rows.length == 0) {
        return res.status(500).json({ message: "Server error" });
      }
      const user = resp.rows[0];
      console.log("user = ", user)
      res.status(200).json({
        message: "Successfully Signed up"
    });
      // Create team for admin
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user
    pool.query(
        `SELECT name,email,id, password FROM users
        WHERE email = $1`, [email], async (err,results) => {
            if(err){
                throw err;
            }
            console.log(results.rows)

            if(results.rows.length == 0){
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const user = results.rows[0];

            // Validate password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
              return res.status(401).json({ message: "Invalid credentials" });
            }
            const token = jwt.sign(
              { user: user },
              process.env.JWT_SECRET,
              { expiresIn: "2h" }
            );
            res.json({ token, user });
        }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {login, signup, protect}
