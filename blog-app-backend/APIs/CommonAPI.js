import exp from 'express'
import {hash,compare} from 'bcryptjs'
import {UserModel} from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import {verifyToken} from '../middlewares/verifyToken.js'
import {upload} from '../config/multer.js'
import {uploadToCloudinary} from '../config/cloudinaryUpload.js'
export const commonApp=exp.Router()
const {sign}=jwt

//body parser middleware
commonApp.use(exp.json())

//Route for register
commonApp.post("/users",upload.single("profileImageUrl"),async(req,res,next)=>{
    try{
        let allowedRoles=["USER","AUTHOR"]
        //get user from req
        const newUser=req.body
        //check role
        if(!allowedRoles.includes(newUser.role)){
            return res.status(400).json({message:"Invalid role"})
        }
        let cloudinaryResult
        //upload image to cloudinary from memory storage
        if(req.file){
            console.log("Uploading to Cloudinary...", req.file.originalname, req.file.size)
            cloudinaryResult = await uploadToCloudinary(req.file.buffer)
            console.log("Cloudinary upload success:", cloudinaryResult?.secure_url)
        }
        //add cdn link(secure_url) to of new userObj
        newUser.profileImageUrl=cloudinaryResult?.secure_url
        //hash password and replace plain with hashed one
        newUser.password=await hash(newUser.password,12)
        //create new user document
        const newUserDocument=new UserModel(newUser)
        //save document
        await newUserDocument.save()
        //send res
        res.status(201).json({message:"User Created"})
    } catch(err){
        console.log("Registration error:", err.message)
        next(err)
    }
})

//Route for login
commonApp.post("/login",async(req,res,next)=>{
    try {
        //get user credentials from body
        const {email,password}=req.body
        //verify
        let user=await UserModel.findOne({email:email})
        //if email not existed
        if(!user){
            return res.status(400).json({message:"Invalid email"})
        }
        //compare password
        const isPasswordValid=await compare(password,user.password)
        //is password is invalid
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"})
        }
        //if passwords matched 
        //create a token
        const signedToken=sign({id:user._id,email:email,role:user.role},process.env.SECRET_KEY,{expiresIn:"1d"})
        //set token to res header as httpOnly cookie
        res.cookie("token",signedToken,{
            httpOnly:true,
            sameSite:"none",
            secure:true
        })
        //remove password from the user document
        const userObj=user.toObject()
        delete userObj.password
        //send response
        res.status(200).json({message:"Login successful",payload:userObj})
    } catch(err) {
        console.log("Login error:", err.message);
        next(err);
    }
})

//Route for logout
commonApp.get("/logout",(req,res)=>{
    //delete token from cookie storage
    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"none",
        secure:true
    })
    //send response
    res.status(200).json({message:"Logout successful"})
})

//Route for check-auth session validation
commonApp.get("/check-auth", verifyToken("USER","AUTHOR","ADMIN"), async(req,res)=>{
    try {
        let user = await UserModel.findById(req.user.id);
        if(!user) {
            return res.status(401).json({message:"User not found"});
        }
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).json({message:"Authorized", payload: userObj});
    } catch (err) {
        res.status(500).json({message:"Server error", error: err.message});
    }
})

//change password
commonApp.put('/password',verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
    //check current password and new password are same
    let passwordObj=req.body
    if(passwordObj.currentPassword===passwordObj.newPassword){
        return res.status(400).json({message:"Current password and new password are same"})
    }
    //get current password of user/admin/author
    let userIdOfToken=req.user?.id
    let user=await UserModel.findById(userIdOfToken)
    let passwordOfToken=user.password
    //check the current password of req and user are not same
    let isPasswordValid=await compare(passwordObj.currentPassword,passwordOfToken)
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid current password"})
    }
    //hash new password
    passwordObj.newPassword=await hash(passwordObj.newPassword,12)
    //replace current password of user with hashed new password
    user.password=passwordObj.newPassword
    //save
    await user.save()
    //send response
    res.status(200).json({message:"Password changed successfully"})
})