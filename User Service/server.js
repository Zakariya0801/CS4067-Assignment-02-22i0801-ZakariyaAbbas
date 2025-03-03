const express = require('express')
require('dotenv').config()
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

// const {pool} = require('./dbConfig');

app.use(
    cors({
      origin: ["http://localhost:5173", "https://purpose-write-main.vercel.app"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
// app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);
app.listen(port, ()=>{
    console.log(`App is litening on Port ${port}`);
});