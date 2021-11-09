const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");



dotenv.config({path:"./config.env"});
require("./db/conn");
// const user = "./model/userSchema";

app.use(express.json());
app.use(cookieParser());



// link the router file make the route //
app.use(require('./routers/auth')); 


const PORT = process.env.PORT;


 app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
 })