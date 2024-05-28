var express = require('express');
var router = express.Router();
const upload = require('../multer/multer')
const userController = require('../server/controller/userController')

// user login and registeration routes!!!!
router.get('/home',userController.home)
// router.get('/login',userController.userLogin)
router.post('/login',userController.loginPost)
// router.get('/register',userController.register)
router.post('/register',upload.single('image'),userController.registerPost)
router.get('/logout',userController.userLogot);

router.post('/editUser',upload.single('image'),userController.editUser)

module.exports = router;
