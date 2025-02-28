const { Router } = require("express");
const {getAllUsers, addNewUser,getUser} = require ('../controllers/userController');
const router = Router();

router
.get('/', (req,res) => {
    res.render('index');
})
.get('/register', (req,res) => {
    res.render('register');
})
.post('/register', addNewUser)
// .post('/register', addNewUser)
.get('/login', (req,res) => {


    res.status(200).json({
        name: "Zakariya"
    })
})
.get('/Dashboard', (req,res) => {
    res.render('Dashboard', {user: "Zakariya"});
});

module.exports = router;
