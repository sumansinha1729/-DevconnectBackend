require('dotenv').config();
const express=require('express');
const http=require('http');
const cors=require('cors');
const mongoose=require('mongoose');
const {Server}=require('socket.io');

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:'*'}});

// DB connect
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("MongoDB connected"))
.catch((err)=>{console.log("Mongo error", err)})

// Middleware
app.use(cors());
app.use(express.json());

// API test
app.get('/api/hello',(req,res)=>{
    res.json({msg:'Devconnect backend is working'})
})

const PORT=process.env.PORT || 5000;

// routes
const authRoutes=require('./routes/authRoutes.js');

app.use('/api/auth',authRoutes);

server.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`)
})