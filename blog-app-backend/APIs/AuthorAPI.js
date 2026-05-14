import exp from 'express'
import {ArticleModel} from '../models/ArticleModel.js'
import {UserModel} from '../models/UserModel.js'
import {verifyToken} from '../middlewares/verifyToken.js'
export const authorApp=exp.Router()

//writee articles
authorApp.post("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    //get articleObj from client
    const articleObj=req.body
    //get user from decoded token
    let userEmail=req.user.email
    //check author
    let author=await UserModel.findById(articleObj.author)
    if(!author){
        return res.status(404).json({message:"Invalid author"})
    }
    if(author.email!==userEmail){
        return res.status(403).json({message:"you are not authorized"})
    }
    //cross check roles
    if(author.role!=="AUTHOR"){
        return res.status(403).json({message:"Invalid role[only author can publish the article]"})
    }
    //create article document
    const articleDocument=new ArticleModel(articleObj)
    //save
    await articleDocument.save()
    //send res
    res.status(201).json({message:"Article published successfully"})
})
//read own articles[all]
authorApp.get("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    //get user from decoded token
    let authorIdOfToken=req.user?.id
    //get articles
    let articles=await ArticleModel.find({author:authorIdOfToken})
    //send res
    res.status(200).json({message:"Articles",payload:articles})
})

//edit article
authorApp.put("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    let authorIdOfToken=req.user?.id
    let {articleId,title,category,content}=req.body
    //update article
    const updatedArticle=await ArticleModel.findOneAndUpdate({_id:articleId,author:authorIdOfToken},{$set:{title,category,content}},{new:true})
    //if either article id or author not correct
    if(!updatedArticle){
        console.log(updatedArticle)
        return res.status(403).json({message:"Not authorized to edit the article"})
    }
    //send res
    res.status(200).json({message:"Article updated successfully",payload:updatedArticle})
})

//delete article[soft delete]
authorApp.patch("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    //get user from decoded token
    let authorIdOfToken=req.user?.id
    //get modified article from client
    const {articleId,isArticleActive}=req.body
    //get article by id
    const articleOfDB=await ArticleModel.findOne({_id:articleId,author:authorIdOfToken})
    //if article not found
    if(!articleOfDB){
        return res.status(404).json({message:"You are not authorized to delete this article/article not found"})
    }
    //check status
    if(isArticleActive==articleOfDB.isArticleActive){
        return res.status(200).json({message:"Article is already in the same state"})
    }
    articleOfDB.isArticleActive=isArticleActive
    await articleOfDB.save()
    res.status(200).json({message:"Article modified",payload:articleOfDB})
})