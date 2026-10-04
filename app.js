// import  express from 'express'

// const port =  4646;
// const app = express();


// app.use(express.json())
// app.use(express.static("public"))

// app.get("/dull",(req,res)=>{
//     res.sendFile(`${import.meta.dirname}/just.png`)

// })
// app.use("/login",(req,res,next)=>{
//     console.log(req.originalUrl);
//     if(req.body.password ==="davood"){
//         next();
//     }
//     else{
//         res.end("Invalid credentials bro");
//     }
// });
// app.post("/login",(req,res)=>{
//     res.end("Welcome davoodbhai")
// })
// app.use("/davood",(req,res,next)=>{
//     res.end("Hello davood bhaithis is first middle ware")
// })

// app.use((req,res,next)=>{
//     req.on("data",(chunk)=>{
//         const reqestbody = JSON.parse(chunk.toString())
//         req.reqestbody = reqestbody;
//         next();
//     })
   
// });
// app.post("/users",(req,res)=>{
//     console.log(req.reqestbody)
//     res.end('Done dawood davood')
// })
// app.get("/",(req,res)=>{
//     res.end("Hello this is home-page")
// });

// app.listen(port,()=>{
//     console.log('Application is started at 4646 port')
// });


// import express from "express"
// import path from 'node:path'
// import {readdir,rm,rename} from 'node:fs/promises'
// import { createWriteStream, stat } from "node:fs";
// import cors from 'cors'


// const app = express();
// app.use(express.json());
// app.use(cors())


// app.post("/files/:filename", (req, res) => {

//     console.log("Uploading:", req.params.filename);

//     const writestream = createWriteStream(
//         `./public/${req.params.filename}`
//     );

//     req.pipe(writestream);

//     req.on("end", () => {
//         res.json({
//             message: "File uploaded"
//         });
//     });

// });

// app.get('/directory',async(req,res)=>{
//     const filelist = await readdir("./public");
//     const resData = []
//     for(const item of filelist){
//         const stats = await stat(`./public/${item}`);
//         resData.push({name:item,isDirectory:stats.isDirectory()})
//     }
//     res.json(resData);
// });
// app.get("/files/:filename",(req,res)=>{
//     const{filename}= req.params;
//     if(req.query.action === "download"){
//         res.set("Content-Disposition","attachment");
//     }
//     res.sendFile(`${import.meta.dirname}/public/${filename}`)
// })

// app.delete("/:filename", async (req, res) => {

//     const { filename } = req.params;

//     const filepath = `${import.meta.dirname}/public/${filename}`;

//     console.log("Filename:", filename);
//     console.log("Filepath:", filepath);

//     try {

//         await rm(filepath);

//         console.log("File deleted!");

//         res.json({
//             message: "File deleted successfully"
//         });

//     } catch (error) {

//         console.log("DELETE ERROR:", error);

//         res.status(404).json({
//             message: "File not found"
//         });

//     }
// });

// app.patch("/:filename", async (req, res) => {

//     const { filename } = req.params;

//     const { newName } = req.body;

//     console.log("Old filename:", filename);
//     console.log("New filename:", newName);

//     const oldPath = path.join(
//         import.meta.dirname,
//         "public",
//         filename
//     );

//     const newPath = path.join(
//         import.meta.dirname,
//         "public",
//         newName
//     );

//     try {

//         await rename(oldPath, newPath);

//         res.json({
//             message: "File renamed successfully"
//         });

//     } catch (error) {

//         console.log("RENAME ERROR:", error);

//         res.status(404).json({
//             message: "File not found"
//         });

//     }
// });

// // import { createWriteStream } from "node:fs";




// app.listen("4000",()=>{
//     console.log('Application started at server 4000')
// })


import express from "express";
import cors from "cors";

import directoryRoutes from './routes/directoryRoutes.js'
import fileRoutes from './routes/fileRoutes.js'


const app = express();

app.use(express.json());
app.use(cors());
app.use("/directory",directoryRoutes)
app.use("/files",fileRoutes)

app.use((err,req,res,next)=>{
    res.status(500).json({message:"Something went wrong!"});
})


// ========================================
// PUBLIC DIRECTORY
// ========================================



// ========================================
// GET DIRECTORY
// ========================================




// ========================================
// UPLOAD FILE / FOLDER FILE
// ========================================



// ========================================
// OPEN / DOWNLOAD FILE
// ========================================




// ========================================
// START SERVER
// ========================================

app.listen(
    4000,
    () => {

        console.log(
            "Application started at server 4000"
        );

    }
);

//what is http redirection
