const {login,signup, protect} = require('../controllers/auth');
const { Router } = require("express");
const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/user', protect);

module.exports = router;