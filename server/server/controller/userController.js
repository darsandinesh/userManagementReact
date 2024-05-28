const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const home = (req, res) => {
    try {
        console.log('home page is called!!!')
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.json({ success: false, message: "NO token please login" })
        } else {
            jwt.verify(token, process.env.JWT_SCRECT, async (err, data) => {
                if (err) {
                    console.log('error in token verification', err)
                    res.json({ success: false, message: 'invalid token' })
                } else {
                    console.log(data);
                    const userData = await userModel.findOne({ email: data.email });
                    res.json({ success: true, message: 'token verification success!!', data: userData });
                }

            })
        }

    } catch (e) {
        console.log('error in the home : ', e);
    }
}

const userLogin = (req, res) => {
    try {
        console.log('login-page!');
        res.send('login-page!')
    } catch (e) {
        console.log('error in the userLogin :', e);
    }
}

const loginPost = async (req, res) => {
    try {
        const userData = await userModel.findOne({ email: req.body.email })
        if (userData) {
            const password = await bcrypt.compare(req.body.password, userData.password);
            if (password) {
                const userDetails = {
                    name: userData.name,
                    email: userData.email,
                    mobile: userData.mobile,
                    image: userData.imagePath,
                    createdAt: userData.createdAt,
                }
                const token = jwt.sign(userDetails, process.env.JWT_SCRECT)
                res.json({ success: true, token: token, data: userDetails });
            } else {
                res.json({ success: false, message: "Invalid password" });
            }

        } else {
            res.json({ success: false, message: 'Invalid email' });
        }
    } catch (e) {
        console.log('error in the loginPost :', e);
    }
}

const register = (req, res) => {
    try {
        console.log('register-funcion');
        res.send('useregister-funcionrGet')
    } catch (e) {
        console.log('error in the register : ', e);
    }
}

const registerPost = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file)
        console.log('register post');
        const path = req.file.path.replace(/\\/g, '/');
        const newPath = path.replace('C:/Users/hp/Desktop/React/week-19/usermanagement/serverside/public', 'http://localhost:4444')
        // http://localhost:4444/
        console.log(path, '..../././././././././');
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const userData = new userModel({
            name: req.body.userName,
            email: req.body.email,
            password: hashedPass,
            mobile: req.body.mobile,
            imagePath: newPath,
        });
        await userData.save()
        console.log(userData);
        res.json({ data: 'data recived success' })
    } catch (e) {
        console.log('error in the registerPost : ', e);
    }
}


const editUser = async (req, res) => {
    try {
        console.log(req.body, 'enter editUser')
        console.log(req.file)
        const userDataUpdate = await userModel.updateOne({ email: req.body.email }, { name: req.body.name, mobile: req.body.mobile })
        if (req.file) {
            const path = req.file.path.replace(/\\/g, '/');
            const newPath = path.replace('C:/Users/hp/Desktop/React/week-19/usermanagement/serverside/public', 'http://localhost:4444')
            const imageUpdate = await userModel.updateOne({ email: req.body.email }, { imagePath: newPath });
        }
        const data = await userModel.findOne({ email: req.body.email });
        console.log(data, '././././.datatatatatatatatatatatta')
        res.json({ msg: 'data updated success', data: data })
    } catch (e) {
        console.log('error in the editUser:', e)
    }
}

const userLogot = (req, res) => {
    try {

    } catch (e) {
        console.log('error in the adminLogout : ', e);
    }
}

module.exports = {
    home,
    userLogin,
    loginPost,
    register,
    registerPost,
    userLogot,
    editUser
}