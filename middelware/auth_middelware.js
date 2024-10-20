const jwt=require("jsonwebtoken");

const authentification=(req,res,next)=>{


    const token=req.cookies.jwt;

    if(token){
        jwt.verify(
            token,
            "123456789",
            (err,decodedToken)=>{
if(err){console.log(err.message);}
else{
    console.log(decodedToken);
    req.user = decodedToken;
next();
}
        })
        
    }

    else{ res.status(401).json({"message":"token invalide"});} //faut res.redirect("/login")

}

module.exports={authentification};