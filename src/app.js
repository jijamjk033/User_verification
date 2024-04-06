const express= require('express');
const app = express();
const session = require("express-session");
const nocache=require('nocache');
const path = require("path");
require("dotenv").config();
const dbConnection = require("../config/dbconfig");

dbConnection();

app.use(session({
    secret:process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine','ejs');
app.set("views", "./view");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(nocache());

// for user route
const userRoute = require("./route/userRoute");
app.use('/',userRoute);

// for admin route
const adminRoute = require("./route/adminRoute");
app.use('/admin',adminRoute);

app.use((req, res, next) => {
    res.status(404).render("./layouts/page_404", { userData: null });
    next();
  });
  
app.listen(3300, ()=>{
    console.log("Server is running on port:  http://localhost:3300");
});


