import express from 'express';
const router=express.Router();
import { adminProtect } from '../middleware/authMiddleware.js';
import{
    authAdmin,
    logoutAdmin,
    getUsers,
    deleteUser,
    updateUserProfile,
    registerUser
} from '../controllers/adminController.js'
import upload from '../config/multer.js'

router.post('/auth',authAdmin)
router.post ('/logout',logoutAdmin)
router.get('/users',adminProtect,getUsers);
router.post('/',adminProtect,upload.single('profilePhoto'),registerUser)
router.delete('/users/delete',adminProtect,deleteUser); 
router.put('/users/updateUser',updateUserProfile);



export default router;