const express = require('express')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;

const {pool} = require('./dbConfig');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
// app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/users',userRoutes);
app.use('/auth',authRoutes);
app.listen(port, ()=>{
    console.log(`App is litening on Port ${port}`);
});