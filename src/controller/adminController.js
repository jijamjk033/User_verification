const User = require("../model/userModel");
const bcrypt = require('bcrypt');

const loadLogin = async (req, res) => {
    try {
        res.render("adminLogin");
    } catch (error) {
        console.log(error.message)
    }
};

const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminData = await User.findOne({ email: email });

        if (adminData) {
            const passwordMatch = await bcrypt.compare(password, adminData.password);

            if (passwordMatch && adminData.is_admin == 1) {
                req.session.admin_id = adminData._id;
                res.redirect("/admin/userData");
            } else {
                res.render("adminLogin", {
                    message: "Email and password are incorrect",
                });
            }
        } else {
            res.render("adminLogin");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const loadUserpage = async (req, res) => {
    try {
        const adminData = await User.findById(req.session.admin_id);

        const usersData = await User.find({
            is_admin: 0
        });

        res.render('userList', { userData: usersData, admin: adminData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error: " + error.message);
    }
};

const logout = async (req, res) => {
    try {
        delete req.session.admin_id;
        res.redirect("/admin");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    loadUserpage,
    logout
};