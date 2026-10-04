import express from 'express';

const app = express();

const PORT = 4000;

app.get("/",(req,res)=>{
    res.send("Hello,World");
});

app.post("/upload",(req,res)=>{
    req.on("data",(chunk)=>{
        console.log(chunk.toString());
    })
})

req.on("end",()=>{
    res.json({message:"Data send!"})
})


app.listen(PORT,()=>{
    console.log("App is listening at port 4000")
})