const express = require('express')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;

const {pool} = require('./dbConfig');

const userRoutes = require('./routes/userRoutes');
// app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

app.use('/users',userRoutes);

app.listen(port, ()=>{
    console.log(`App is litening on Port ${port}`);
});