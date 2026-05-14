import exp from 'express'
import { UserModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
import {verifyToken} from '../middlewares/verifyToken.js'
export const userApp=exp.Router()

//read all articles of all authors
userApp.get('/articles',verifyToken("USER"),async(req,res)=>{
    //Read articles
    let articles=await ArticleModel.find({isArticleActive:true})
    //send response
    res.status(200).json({message:"Articles found successfully",payload:articles})
})

//Add comment to an article
userApp.put('/articles',verifyToken("USER"),async(req,res)=>{
    //get body from req
    const {articleId,comment}=req.body
    //check article exists and is active
    const articleDocument=await ArticleModel.findOne({_id:articleId,isArticleActive:true}).populate("comments.user")
    //if article not found
    if(!articleDocument){
        return res.status(404).json({message:"Article not found"})
    }
    //get user id
    const userId=req.user?.id
    //add comment to the comments array of the article Document
    articleDocument.comments.push({user:userId,comment:comment})
    //save
    await articleDocument.save()
    //send response
    res.status(200).json({message:"Comment added successfully",payload:articleDocument})
})