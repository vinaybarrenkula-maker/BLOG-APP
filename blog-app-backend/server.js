import exp from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import {userApp} from './APIs/UserAPI.js'
import {authorApp} from './APIs/AuthorAPI.js'
import {adminApp} from './APIs/AdminAPI.js'
import {commonApp} from './APIs/CommonAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config()
const app=exp()
//add cookie parser middleware
app.use(cookieParser())
//add cors middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))
//body parser middleware
app.use(exp.json())

//path level middlewares
app.use("/user-api",userApp)
app.use("/author-api",authorApp)
app.use("/admin-api",adminApp)
app.use("/auth",commonApp)

// Serve static files from the React frontend app
app.use(exp.static(path.join(__dirname, '../blog-app-frontend/dist')))

// Anything that doesn't match the above, send back index.html
app.get('(.*)', (req, res) => {
  // Check if it's an API request that failed - if so, don't send index.html
  if (req.url.startsWith('/user-api') || req.url.startsWith('/author-api') || req.url.startsWith('/admin-api') || req.url.startsWith('/auth')) {
    return res.status(404).json({message: `path ${req.url} is invalid`})
  }
  res.sendFile(path.join(__dirname, '../blog-app-frontend/dist/index.html'))
})

//connect to db
const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB connected")
        //assign port
        const port=process.env.PORT || 6000
        app.listen(port,()=> console.log(`Server listening on ${port}....`))
    }
    catch(err){
        console.log("Error in connecting to database:",err)
    }
}

connectDB()

//Error handling middleware
app.use((err, req, res, next) => {
  console.log("Error message:", err.message);
  console.log("Error name:", err.name);
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: `${field === 'email' ? 'Email' : field} "${value}" already exists. Please use a different one.`,
      error: `${field} already exists`,
    });
  }

  //send server side error
  res.status(err.status || 500).json({ message: "error occurred", error: err.message || "Server side error", fullError: err });
});