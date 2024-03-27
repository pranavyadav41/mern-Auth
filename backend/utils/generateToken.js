import jwt from 'jsonwebtoken';

const generateToken = (res,userId,admin=false)=>{

    const secretKey="123qwert"
    const name = admin?"adminjwt":"jwt"
    const token=jwt.sign({userId},secretKey,{
        expiresIn:'30d'
    })
 
    res.cookie(name,token,{
        httpOnly:true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:'strict',
        maxAge:30*24*60*60*1000
    })

}

export default generateToken