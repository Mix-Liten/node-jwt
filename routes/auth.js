const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Validation
const {
  registerValidation, loginValidation
} = require('../validation/User');

router.post('/register', async (req, res) => {
  const {
    error
  } = registerValidation(req.body);
  if (error) return res.status(400).json({
    errorMessage: error.details[0].message
  });

  const emailExist = await User.findOne({
    email: req.body.email
  });
  if (emailExist) return res.status(400).json({
    errorMessage: 'Email already exists.'
  });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const saveUser = await user.save();
    res.json({
      user: saveUser._id
    });
  } catch (err) {
    res.status(400).json({
      errorMessage: err
    });
  }
})

router.post('/login', async (req, res) => {
  const {
    error
  } = loginValidation(req.body);
  if (error) return res.status(400).json({
    errorMessage: error.details[0].message,
  });

  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) return res.status(400).json({
    errorMessage: 'Email is not found.'
  });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({
    errorMessage: 'Invalid password.'
  });

  const token = jwt.sign({
    _id: user._id
  }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
})

module.exports = router;