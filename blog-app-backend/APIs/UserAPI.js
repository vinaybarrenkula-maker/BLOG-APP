import exp from 'express'
import { UserModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
import {verifyToken} from '../middlewares/verifyToken.js'
export const userApp=exp.Router()

//read all articles of all authors (public)
userApp.get('/articles',async(req,res)=>{
    //Read articles
    let articles=await ArticleModel.find({isArticleActive:true}).populate('author','firstName lastName email')
    //send response
    res.status(200).json({message:"Articles found successfully",payload:articles})
})

//read a single article by id (public)
userApp.get('/article/:id',async(req,res)=>{
    const { id } = req.params;
    try {
        let article=await ArticleModel.findOne({_id:id, isArticleActive:true})
            .populate('author','firstName lastName email')
            .populate('comments.user','email');

        if(!article){
            return res.status(404).json({message:"Article not found"})
        }

        res.status(200).json({message:"Article found successfully",payload:article})
    } catch(err) {
        return res.status(400).json({message:"Invalid article id", error: err.message})
    }
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