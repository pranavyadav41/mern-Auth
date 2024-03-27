import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'
import Admin from '../models/adminModel.js'
import generateToken from "../utils/generateToken.js"


//@desc  Auth admin/set token
//route Post/api/admin/auth
//@access Public
const authAdmin=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const admin=await Admin.findOne({email});
    if(admin&&(await admin.matchPassword(password))) {
        generateToken(res,admin._id,"adminJwt");
        res.status(201).json({
            _id:admin._id,
            email:admin.email,
        });
    }else{
        res.status(401);
        throw new Error("Invalid email or password")
    }
});

//@desc  Logout admin
//route Post/api/admin/logout
//@access Public
const logoutAdmin=asyncHandler(async(req,res)=>{
    res.cookie("adminJwt","",{
        httpOnly:true,
        expires:new Date(0),
    })
    res.status(200).json({message:"admin logged out."})
})

//@desc  User data
//route Post/api/admin/users
//@access Private
const getUsers=asyncHandler(async(req,res)=>{
    const users=await User.find({}).select("-password");
    res.json({users});
})

//@desc  Delete user
//route  DELETE /api/admin/users/delete
//@access Private
const deleteUser=asyncHandler(async(req,res)=>{
    const userId=req.query.id;
    if(!userId){
        res.status(400);
        throw new Error("Invalid user data")
    }
    const deletedUser=await User.findByIdAndDelete(userId);
    if(deletedUser){
        res.status(200).json({message:"User deletion successfull"})
    }else{
        res.status(400);
        throw new Error("Invalid user data")
    }
});

//@desc  updateUserProfile
//route PUT/api/admin/users/update
//@access Private
const updateUserProfile =asyncHandler(async (req,res)=>{
    console.log(req.body)
    const user=await User.findById(req.body.userId);
    if(user){
        user.name=req.body.updatedData.name ||user.name;
        user.email=req.body.updatedData.email||user.email;

        if(req.body.password){
            user.password=req.body.updatedData.password;
        }

        const updatedUser=await user.save();

        const response={
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
        };
        res.status(200).json(response)
    }else{
        res.status(404);
        throw new Error("user not found")
    }
});

//@desc  createUser
//route POST/api/admin/create
//@access Private

const registerUser=asyncHandler(async(req,res)=>{
    const { name, email,password} = req.body;

  const profilePhoto=req.file.filename;
  
  

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    profilePhoto
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password:user.password,
      profilePhoto:user.profilePhoto
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }

})



export {
    authAdmin,
    logoutAdmin,
    getUsers,
    deleteUser,
    updateUserProfile,
    registerUser
}

