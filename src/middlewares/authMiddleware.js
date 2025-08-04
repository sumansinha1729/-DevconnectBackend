const jwt=require('jsonwebtoken');

exports.authMiddleware=(req,res,next)=>{
    const auth=req.headers.authorization;
    if(!auth || !auth.startsWith('Bearer ')) return
    res.status(401).json({message:"No token"});

    const token=auth.split(' ')[1];
    try {
        req.user=jwt.verify(token,process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({message:"Invalid token"})
    }
}