const User = require("../model/userModel");
const bcrypt = require('bcrypt');


//Display Home page
const loadHome = async (req, res) => {
    try {
        if (!req.session.user_id) {
            res.render("home");
        } else {
            const userData = await User.findById({ _id: req.session.user_id });
            res.render("home", { userData: userData });
        }
    } catch (error) {
        console.log(error.message);
    }
};
//Display Login page
const loginLoad = async (req, res) => {

    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

//Verifies User Login
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch && userData.is_admin == 0) {
                if ((req.session.user_id = userData._id)) {
                    res.redirect("/");
                }
            } else {
                res.render("login", { message: "Email and password is incorrect" });
            }
        } else {
            res.render("login", { message: "Email and password is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

//Display registration page
const loadRegister = async (req, res) => {
    try {
        res.render('registration');

    } catch (error) {
        console.log(error.message);
    }
}

//Encrypts the password recieved as parameter
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}
//Adds a new user in Register
const insertUser = async (req, res) => {
    try {
        const email = req.body.email;
        const mobile = req.body.mobile;
        const name = req.body.name;
        const password = req.body.password;
        const securedPassword = await securePassword(password);

        const existMail = await User.findOne({ email: email });
        if (existMail) {
            return res.render('registration', { message: "This user already exists" });
        }
        const user = new User({
            name: name,
            email: email,
            mobile: mobile,
            password: securedPassword,
            is_admin: 0,
            is_blocked: 0,
        });

        const userDataSave = await user.save();

        if (!email || !mobile || !name || !password) {
            return res.render('registration', {
                message: "Please enter all the fields"
            });
        }

        if (userDataSave) {
            return res.redirect("/login");
        } else {
            return res.render("register", { message: "Registration Failed" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).render("error", { message: "Internal Server Error" });
    }
};

// Load user profile page
const loadprofile = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const userData = await User.findById(userId);
        if (userData) {
            res.render("profile", { userData });
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error.message);
    }
};
// Update user data in database
const userEdit = async (req, res) => {
    try {
        const id = req.body.user_id;
        const { name, mobile } = req.body;
        let updateData;

        if (!req.file) {
            updateData = await User.findByIdAndUpdate(
                id,
                { $set: { name, mobile } },
                { new: true }
            );
        } else {
            updateData = await User.findByIdAndUpdate(
                id,
                { $set: { name, mobile, image: req.file.filename } },
                { new: true }
            );
        }

        if (!updateData) {
            return res.status(404).render("error", { message: "User not found" });
        }

        res.redirect("/profile");
    } catch (error) {
        console.log(error.message);
        return res.status(500).render("error", { message: "Internal Server Error" });
    }
};

//Profile pic update
const updateUserProfilepic = async (req, res) => {
    try {
        const userData = await User.findById(req.session.user_id);

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const croppedImage = req.file.filename;

        await User.findByIdAndUpdate(userData._id, {
            $set: {
                image: croppedImage,
            },
        });

        res.status(200).json({ success: true, message: 'Profile Picture changed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const togglePrivacy = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the 'is_private' status
        userData.is_private = !userData.is_private;

        await userData.save();

        res.redirect("/profile");
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

//User Logout
const userLogout = async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  
module.exports = {
    loginLoad,
    securePassword,
    loadHome,
    verifyLogin,
    loadRegister,
    insertUser,
    loadprofile,
    userEdit,
    updateUserProfilepic,
    userLogout,
    togglePrivacy

}