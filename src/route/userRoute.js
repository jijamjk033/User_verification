const express = require("express");
const user_route = express();
const auth = require("../middleware/authMiddleware");
const multer = require("../middleware/multer");
const userController = require("../controller/userController");

user_route.use(express.static("public"));

user_route.set('views','./view/user');

user_route.get('/',userController.loadHome);

user_route.get('/login',auth.isLogout,userController.loginLoad);
user_route.post('/login',userController.verifyLogin);
user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.post('/register',userController.insertUser);
user_route.get('/profile',auth.isLogin,userController.loadprofile);
user_route.post('/profile', multer.uploadUser.single("profile_image"),userController.userEdit);
user_route.post('/uploadProfileImage', multer.uploadUser.single("profile_image"),userController.updateUserProfilepic);
user_route.get('/togglePrivacy', auth.isLogin, userController.togglePrivacy);
//Logout
user_route.post('/logout',auth.isLogin,userController.userLogout);


module.exports = user_route;