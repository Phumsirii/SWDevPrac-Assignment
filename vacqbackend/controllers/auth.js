const User=require('../models/User');

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register=async(req,res,next)=>{
    try{
        const {name,email,password,role}=req.body;

        const user=await User.create({
            name,
            email,
            password,
            role
        });
        //Create Token
        // const token=user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);
    }
    catch (err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}

exports.login = async (req,res,next)=>{
    const  {email,password}=req.body;
    //validate email or password
    if (!email || !password){
        return res.status(400).json({success:false,msg:"Please provide an email and password"});
    }
    //check for user
    const user=await User.findOne({email}).select('+password');
    if (!user){
        return res.status(400).json({success:false,msg:"Invalid credentials"});
    }
    //check if password matches
    const isMatch=await user.matchPassword(password);
    if (!isMatch){
        return res.status(401).json({success:false,msg:'Invalid credentials'});
    }
    //create token
    // const token=user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    sendTokenResponse(user,200,res);
}


//Get Token from model, Create cookie and send response
const sendTokenResponse=(user,statusCode,res)=>{
    //Create Token
    const token=user.getSignedJwtToken();
    const options={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000), //set expired date of this cookie in ms
        httpOnly:true
    };
    if (process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        //add for frontend
        _id:user._id,
        name:user.name,
        email:user.email,
        //end for frontend
        token
    });
}

//get current logged user
exports.getMe=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({success:true,data:user});
}