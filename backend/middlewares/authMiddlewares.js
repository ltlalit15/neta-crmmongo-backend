const jwt =require("jsonwebtoken")
const asynchandler =require("express-async-handler")
const User = require("../Model/userModel")

const protect = asynchandler(async(req,res,next)=>{
    let token

   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try {
        //token
        token=req.headers.authorization.split(' ')[1]

        // verfy token 
        const decoded= jwt.verify(token,process.env.JWT_SECRT)

        //user from token
        req.user=await User.findById(decoded.id).select("-password")
    
     
        const allowEntry = req.user.isAdmin;

        if (allowEntry) {
            next();
        } else {
            console.log("Not Allowed");
            res.status(403).json({ error: "Not Allowed" }); // Use 403 for forbidden access
        }
    

    } catch (error) {
        console.log(error);
        res.status(401)
        throw new Error("Not Authorization!")  
    }
   }
   if(!token){
    res.status(401)
    throw new Error("Not authorization")
}
})

module.exports = {protect}