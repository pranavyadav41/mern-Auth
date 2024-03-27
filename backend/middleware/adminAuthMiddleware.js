import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js"

const protect =asyncHandler(async(req,res,next)=>{
    let token;

    token=req.cookies.admin;
    if(token){
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await Admin.findById(decoded.userId).select("-password")
            next();
            
        } catch (err) {
            console.log(err.message);
            res.status(401);
            throw new Error("not authorized,no token")
            
        }
    }else{
        console.log("No token")
    }
})

export {protect}