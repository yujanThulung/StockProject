import jwt from "jsonwebtoken";


export const generateTokenAndCookie =(res,userId)=>{
    const token = jwt.sign({id:userId},
        process.env.JWT_SECRET,
        {
            expiresIn: '30d',
        }
    );
    res.cookie("token",token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, 
    })

    return token;
}