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


//############### INSCRI ##############################################
const registerUtilisateur = async (req, res) => {
    try {
        const data = req.body;

        
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const phoneRegex = /^\d{8}$/;

        const list_required = [data.nom, data.prenom, data.password, data.telephone, 
            data.dateNaissance, 
            data.sexe];

for (let i = 0; i < list_required.length; i++) {
    if (!list_required[i]) { 
        return res.status(400).json({ message: 'tous les champs sont obligatoires' });
    }
}
   
             

        // verification email et mdp et telephone
        if (!emailRegex.test(data.email)) {
            return res.status(400).json({ message: 'email invalide' });}

        if (!passwordRegex.test(data.password)) {
            return res.status(400).json({ message: 'password invalide' });
        }

        if (!phoneRegex.test(data.telephone)) {
            return res.status(400).json({ message: 'num de téléphone invalide : doit contenir 8 chiffres.' });
        }    

//verif email dans la database
        const database_email = await Utilisateur.findOne({ email: data.email });
        if (database_email) {
            return res.status(400).json({ message: 'essayer un autre email ' });
        }

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


//############### LOGIN ##############################################
const loginUser=async(req,res)=>{
    data=req.body;
    user=await Utilisateur.findOne({email:data.email});

    if(!user || !data ){res.status(404).send("email or password not correct");}
    else{

    validpass=bcrypt.compareSync(data.password,user.password); //pour la comparer avec mdp de user d email trouvé

       if(!validpass) {res.status(404).send("email or password invalide");}

       else {
        payload={_id:user._id,email:user.email,name:user.name};
       token=jwt.sign(payload,"123456789",{expiresIn:"1h"}); 
            res.status(200).send(token);}
    }}


//############### mise a jour user ##############################################
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


//############### delete user ##############################################
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
    updateUtilisateur,
    deleteUtilisateur,
    registerUtilisateur,
    loginUser,

}
