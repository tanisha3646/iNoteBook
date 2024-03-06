const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchUser");

const JWT_SECRET = "TaniIsA$BeautifulGirl@$";

// ROUTE-2 : Create a user using POST "api/auth/createUser" --> no login required
router.post('/createUser', [
    body("name", "Enter a valid name").isLength({min:2}),
    body("password", "Enter a valid email").isLength({min:5}),
    body("email", "Password must be 6 characters long").isEmail()
], async (req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // unique email
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success, errors: "Email alreay exists" });
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email
            })
        }
        const data ={
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authToken});
    }
    catch(err){
        console.error(err);
        res.status(500).send(success, "Some error occured");
    }
});


// ROUTE-2 : Authenticate a user using POST "api/auth/createUser" --> no login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body("password", "Password cannot be blank").exists()
], async (req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // unique email
    try{
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if(!user){
            success = false;
            return res.status(400).json({success, error : "Invalid User"})
        }
        const passCmp = await bcrypt.compare(password, user.password);
        if(!passCmp){
            success = false;
            return res.status(400).json({success,error : "Invalid password"})
        }

        const data ={
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authToken})
    }
    catch(err){
        console.error(err);
        res.status(500).send("Some error occured");
    }
});

// ROUTE-3 : Get loggedIn user details  using POST "api/auth/getUser" --> Login required
router.post('/getUser', fetchuser, async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        const userId = req.id;
        const user = await User.findOne(userId);
        res.send(user);
    }
    catch(err){
        console.error(err);
        res.status(500).send("Some error occured");
    }
});

module.exports = router;