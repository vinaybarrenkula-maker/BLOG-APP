import exp from 'express'
import {UserModel} from '../models/UserModel.js'
import {verifyToken} from '../middlewares/verifyToken.js'
export const adminApp=exp.Router()

adminApp.get("/users",verifyToken("ADMIN"),async(req,res)=>{
    let users=await UserModel.find({role:"USER"})
    res.status(200).json({message:"Users found successfully",payload:users})
})

adminApp.get("/authors",verifyToken("ADMIN"),async(req,res)=>{
    let authors=await UserModel.find({role:"AUTHOR"})
    res.status(200).json({message:"Authors found successfully",payload:authors})
})

adminApp.patch("/users",verifyToken("ADMIN"),async(req,res)=>{
    let {userId,isUserActive}=req.body
    let user=await UserModel.findOne({_id:userId})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    if(isUserActive==user.isUserActive){
        return res.status(200).json({message:"User is already in the same state"})
    }
    user.isUserActive=isUserActive
    await user.save()
    res.status(200).json({message:"User modified",payload:user})
})