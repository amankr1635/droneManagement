const express= require("express");
const mongoose = require("mongoose");
const routes =  require("./router.js/router");

const app = express();
app.use(express.json())

mongoose.connect("mongodb+srv://amankr1635:z1hZMw8tIYcn39Tv@cluster0.iu9csm2.mongodb.net/flytBase")
.then(()=> console.log("MongoDB is Connected"))
.catch((err)=>console.log(err))


app.use("/",routes)

const port = 3001

app.listen(port, ()=>{
    console.log("Server Is Running On "+ port)
})