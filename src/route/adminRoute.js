const express = require('express');
const admin_route = express();
const adminAuth = require("../middleware/adminAuth");
const adminController = require("../controller/adminController");

admin_route.set("views","./view/admin");

admin_route.get('/',adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/userData',adminAuth.isLogin,adminController.loadUserpage);
admin_route.get('/adminLogout', adminAuth.isLogin,adminController.logout);

module.exports = admin_route;