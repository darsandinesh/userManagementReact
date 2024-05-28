var express = require('express');
var router = express.Router();
const adminController = require('../server/controller/adminiController');
const { route } = require('./users');


// admin login control routers
// router.get('/',adminController.adminLogin);
router.post('/login', adminController.adminLoginPost);
router.get('/home', adminController.adminVerification, adminController.home);
router.post('/deleteUser', adminController.deleteUser)
router.get('/logout', adminController.adminLogot);

module.exports = router;
