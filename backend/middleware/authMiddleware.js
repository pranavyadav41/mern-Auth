import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import Admin from '../models/adminModel.js'


const protect = async(req,res,next)=>{
    let token;

    token = req.cookies.jwt;

    if(token){
        try {

            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.userId).select('-password')

            next();
            
        } catch (error) {
            console.log(error.message)
        }
        
    }else{
        console.log("Not autorized, no token")
    }
}

const adminProtect = async(req,res,next)=>{
    let token;

    token = req.cookies.adminjwt;

    if(token){
        try {

            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user=await Admin.findById(decoded.userId).select('-password')

            next();
            
        } catch (error) {
            console.log(error.message)
        }
        
    }else{
        console.log("Not autorized, no token")
    }
}

export { protect,adminProtect }