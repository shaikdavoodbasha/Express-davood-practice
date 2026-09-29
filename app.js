import  express from 'express'

const port =  4646;
const app = express();

app.use((req,res,next)=>{
    req.on("data",(chunk)=>{
        const reqestbody = JSON.parse(chunk.toString())
        req.reqestbody = reqestbody;
        next();
    })
   
});
app.post("/users",(req,res)=>{
    console.log(req.reqestbody)
    res.end('Done dawood davood davood davood bhai')
})
app.get("/",(req,res)=>{
    res.end("Hello this is home-page")
});

app.listen(port,()=>{
    console.log('Application is started at 4646 port')
});