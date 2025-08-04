const jwt=require('jsonwebtoken');
const User=require('../models/User.js');
const { json } = require('express');

function generateToken(user){
    return jwt.sign({userId:user._id,name:user.name,email:user.email,avatar:user.avatar},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );
}

exports.signup=async(req,res)=>{
    try {
        const {name,email,password,avatar}=req.body;
        const existing=await User.findOne({email});
        if(existing) return res.status(400).json({message:"Email already exists"});
        const user=await User.create({name,email,password,avatar});
        const token=generateToken(user);
        res.status(201).json({token,
            user:{...user.toObject(),
                password:undefined
            },
        })
    } catch (error) {
        res.status(500).json({message:"Signup failed",error:error.message})
    }
};

exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user || !(await user.comparePassword(password))) return
        res.status(401).json({message:"Invalid credentials"});
        const token=generateToken(user);
        req.json({token,
            user:{...user.toObject(),password:undefined}
        });
    } catch (error) {
        res.status(500).json({message:"Lof=gin failed",error:error.message})
    }
};