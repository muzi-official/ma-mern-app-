const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const user = require("../model/userSchema");



router.get("/",  (req, res) => {
    res.send("home page");
})


// using  promise concept signup method//
// router.post('/register', (req, res)=> {
//     const {name , email , phone, work , password, cpassword} = req.body; 

//     if(!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error : "plz fill the field" });
//     }

// user.findOne({email:email})
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error : "email already exist" });
// }

// const user = new User({ name , email , phone, work , password, cpassword})

// user.save().then(()=> {
//     res.status(201).json({message: "user registered successfully..!"});
// }).catch((err)=> {
//     res.status(500).json({error: "failed to register..!"})
//         })

//      }).catch(err => {console.log(err);
//     });

// });





// using async and await concept signup method//
router.post('/signup', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "plz fill the field" });
    }

    try {

        const userExist = await user.findOne({ email: email })

        if (userExist) {
            return res.status(422).json({ error: "email already exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password not matching..!" });
        } else {
            const user = new User({ name, email, phone, work, password, cpassword });

            // hash password concept using bcryptjs//

            await user.save();

            res.status(201).json({ message: "user registered successfully..!" });
        }


    } catch (err) {
        console.log(err);
    }

});





// Signin method async await //
router.post("/signin", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Plz Field the data" });
        }

        const userLogin = await user.findOne({ email: email });


        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();

            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
            });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials..!" });
            }
            else {
                res.json({ message: "user login Successfully..!" });
            }
        }
        else {
            res.status(400).json({ error: "Invalid Credientials..!" });
        }

    } catch (err) {
        console.log(err);
    }


});



//about us user authenticate //
router.get("/about", authenticate, (req, res) => {
    res.send(req.user);
});



// contact us apge and home page user data roting new create //
router.get('/getdata', authenticate, (req, res) => {
    res.send(req.user);
})

 
router.post('/contact', authenticate, async (req, res) => {
    try {

        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.json({ error: "plz fill the contact form..!" });
            console.log("error in contact from");
        }

        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {
            
            const userMessage = await userContact.addMessage(name, email, phone, message);
 
            await userContact.save();

            res.status(201).json({ message: "User Contact Successfully..!" })
        }

    } catch (err) {
        console.log(err);
    }
});
 


//logout functionality concept coding //
router.get('/logout', (req, res) => {
res.clearCookie('jwt', { path: '/signin' })
res.status(200).send("Logout Successfull..!");
});


module.exports = router;

