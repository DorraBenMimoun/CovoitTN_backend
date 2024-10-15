const Utilisateur = require('../models/utilisateur.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');






const getUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find();
        res.status(200).json(utilisateurs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


const getUtilisateurById = async (req, res) => {
    try {
        const id = req.params.id;
        const utilisateur = await Utilisateur.findById(id);
        res.status(200).json(utilisateur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const createUtilisateur = async (req, res) => {
    // try {
    //     const utilisateur = await Utilisateur.create(req.body);
    //     res.status(200).json(utilisateur);
    // } catch (err) {
    //     res.status(500).json({ message: err.message });
    // }
    console.log("try /user/register");
    res.status(200).json({ message: "try /user/register" });
}

const registerUtilisateur = async (req, res) => {
    try {
        const data = req.body;
        const usr = new Utilisateur(data);

       
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(usr.password, salt);
        
      
        usr.password = hashedPassword;

       
        const savedUtilisateur = await usr.save();
        res.status(200).json(savedUtilisateur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser=async(req,res)=>{
    data=req.body;
    user=await Utilisateur.findOne({email:data.email});

    if(!user){res.status(404).send("email or password not correct");}
    else{

    validpass=bcrypt.compareSync(data.password,user.password); //pour la comparer avec mdp de user d email trouvé

       if(!validpass) {res.status(404).send("email or password invalide");}

       else {
        payload={_id:user._id,email:user.email,name:user.name};
       token=jwt.sign(payload,"123456789",{expiresIn:"1h"}); 
            res.status(200).send(token);}
    }}


const updateUtilisateur = async (req, res) => {
    try {
        const id = req.params.id;
        const utilisateur = await Utilisateur.findByIdAndUpdate
        (id, req.body, { new: true });
        if (!utilisateur) {
            res.status(404).json({ message: 'Utilisateur not found' });
        }
        const updatedUtilisateur = await Utilisateur.findById(id);
        res.status(200).json(updatedUtilisateur);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const deleteUtilisateur = async (req, res) => {
    try {
        const id = req.params.id;
        const utilisateur = await Utilisateur.findByIdAndDelete(id);
        if (!utilisateur) {
            res.status(404).json({ message: 'Utilisateur not found' });
        }
        res.status(200).json(utilisateur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
module.exports = {
    getUtilisateurs,
    getUtilisateurById,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur,
    registerUtilisateur,
    loginUser,

}
