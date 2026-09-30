import  express from 'express'

const port =  4646;
const app = express();


app.use(express.json())
app.use(express.static("public"))

app.get("/dull",(req,res)=>{
    res.sendFile(`${import.meta.dirname}/just.png`)

})
app.use("/login",(req,res,next)=>{
    console.log(req.originalUrl);
    if(req.body.password ==="davood"){
        next();
    }
    else{
        res.end("Invalid credentials bro");
    }
});
app.post("/login",(req,res)=>{
    res.end("Welcome davoodbhai")
})
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

app.listen(port,()=>{
    console.log('Application is started at 4646 port')
});