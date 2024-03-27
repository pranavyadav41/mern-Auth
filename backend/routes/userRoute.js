import express from 'express';
const router=express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
} from '../controllers/userController.js'
import {protect} from '../middleware/authMiddleware.js'
import upload from '../config/multer.js'


router.post('/',upload.single('profilePhoto'),registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
router.get('/profile',protect,getUserProfile)
router.put('/profile',protect,upload.single('profilePhoto'),updateUserProfile)

export default router;