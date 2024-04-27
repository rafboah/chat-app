const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET;

// User signup endpoint business logic
exports.signup = async (req, res) => {
    try {
        const newUser = User({
            email: req.body.email,
            username: req.body.username,
            fullname: req.body.fullname,
            password: req.body.password,
            gender: req.body.gender
        });
        await newUser.save();
        res.status(201).send('New User registered successfully');
    } catch (error) {
        if(error.name === 'ValidationError')
            return res.status(400).send(error.message);

        res.status(500).send('Internal Server Error');
    }
};

// User login endpoint business logic
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user || !await user.comparePassword(req.body.password))
            return res.status(401).send('Invalid username or password');

        const token = jwt.sign({userId: user._id}, jwtSecret, {expiresIn: '50h'});
        res.json({token});

        // for test purposes
        console.log('UserId: ', req.user.userId);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};