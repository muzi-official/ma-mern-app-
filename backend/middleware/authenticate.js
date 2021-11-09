const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");




const Authenticate = async (req, res, next) => {
  try {

    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ _id: verifyUser._id, "tokens.token": token });

    if (!user) { throw new Error('User not Found..!') }

    req.token = token;
    req.user = user;
    req.userID = user._id;
    next();


  } catch (err) {
    res.status(401).send('Unauthorized:No Token Provided..!');
  }
}

module.exports = Authenticate;