const Utilisateur = require('../models/utilisateur.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^[A-Za-z\d]{6,}$/;
const phoneRegex = /^\d{8}$/;
const nameRegex = /^[a-zA-ZÀ-ÿ\- ]{2,}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;


const getUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.status(200).json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUtilisateurById = async (req, res) => {
  try {
    const id = req.params.id;
    const utilisateur = await Utilisateur.findById(id);
    res.status(200).json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//############### INSCRI ##############################################
const registerUtilisateur = async (req, res) => {
  try {
    // Data is in formdata format

    const data = req.body;

    const list_required = [
      data.nom,
      data.prenom,
      data.password,
      data.phone,
      data.dateNaissance,
      data.sexe,
    ];

    for (let i = 0; i < list_required.length; i++) {
      if (!list_required[i] || (typeof list_required[i] === 'string' && list_required[i].trim() === '')) {
        return res.status(400).json({ message: 'tous les champs sont obligatoires' });
      }
       else {
        if (!emailRegex.test(data.email)) {
          //verifier email and mdp
          return res.status(400).json({ message: 'email invalide' });
        } else {
          if (!nameRegex.test(data.nom)) {
            return res.status(400).json({ message: 'name invalide' });
          }

          if (!nameRegex.test(data.prenom)) {
            return res.status(400).json({ message: 'prenom invalide' });
          }
       

          if (!dateRegex.test(data.dateNaissance)) {
            return res.status(400).json({
              message: 'date de naissance invalide format YYYY-MM-DD',
            });
          }

          if (!passwordRegex.test(data.password)) {
            return res.status(400).json({ message: 'password invalide' });
          }

          if (!phoneRegex.test(data.phone)) {
            return res.status(400).json({
              message: 'num de téléphone invalide : doit contenir 8 chiffres.',
            });
          }
        }
      }
    }

    //verif email dans la database ou pas (l'unicité)
    const database_email = await Utilisateur.findOne({ email: data.email });
    if (database_email) {
      return res.status(400).json({ message: 'essayer un autre email ' });
    }

    const usr = new Utilisateur(data);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(usr.password, salt);

    usr.password = hashedPassword;

    const savedUtilisateur = await usr.save();

    const token = await create_tkn(savedUtilisateur._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user_id: savedUtilisateur._id,
      token: token,
      user: savedUtilisateur,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//####################TOKEN Create#####################################

const create_tkn = (id) => {
  const payload = { id };
  secret = '123456789';
  const maxAge = 3 * 24 * 60 * 60;

  return jwt.sign(payload, secret, { expiresIn: maxAge });
};

//############### LOGIN ##############################################
const loginUser = async (req, res) => {
  const data = req.body;

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!data || !emailRegex.test(data.email) || data.password.trim() === '') {
    return res.status(400).json({ message: 'format invalide' });
  } else {
    try {
      const user = await Utilisateur.findOne({ email: data.email });

      if (!user) {
        return res.status(404).json({ message: 'email or password invalide' });
      } else {
        const validPass = bcrypt.compareSync(data.password, user.password);
        if (!validPass) {
          return res
            .status(404)
            .json({ message: 'email or password incorrect' });
        } else {
          const token = create_tkn(user._id);
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
          });
          res.status(200).json({ token: token, user: user });
        }
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};

//############### mise a jour user ##############################################
const updateUtilisateur = async (req, res) => {
  try {
    const id = req.params.id;

    // Vérification de l'accès utilisateur
    if (!req.user || req.user.id !== id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const data = req.body;

    // Champs obligatoires pour la mise à jour
    const list_required = [
      data.nom,
      data.prenom,
      data.dateNaissance,
      data.phone,
      data.sexe,
    ];

    for (let i = 0; i < list_required.length; i++) {
      if (!list_required[i] || list_required[i].trim() === '') {
        return res
          .status(400)
          .json({ message: 'Tous les champs obligatoires doivent être remplis' });
      }
    }

    // Vérification des formats des champs
    if (data.email && !emailRegex.test(data.email)) {
      return res.status(400).json({ message: 'Email invalide' });
    }

    if (data.nom && !nameRegex.test(data.nom)) {
      return res.status(400).json({ message: 'Nom invalide' });
    }

    if (data.prenom && !nameRegex.test(data.prenom)) {
      return res.status(400).json({ message: 'Prénom invalide' });
    }

    if (data.dateNaissance && !dateRegex.test(data.dateNaissance)) {
      return res
        .status(400)
        .json({ message: 'Date de naissance invalide (format YYYY-MM-DD)' });
    }

    if (data.password && !passwordRegex.test(data.password)) {
      return res
        .status(400)
        .json({ message: 'Mot de passe invalide (au moins 6 caractères)' });
    }

    if (data.phone && !phoneRegex.test(data.phone)) {
      return res
        .status(400)
        .json({ message: 'Numéro de téléphone invalide (8 chiffres)' });
    }

    // Vérification de l'unicité de l'email
    if (data.email) {
      const existingUser = await Utilisateur.findOne({ email: data.email, _id: { $ne: id } });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'Cet email est déjà utilisé par un autre utilisateur' });
      }
    }

    // Hash du mot de passe si modifié
    if (data.password) {
      const salt = bcrypt.genSaltSync(10);
      data.password = bcrypt.hashSync(data.password, salt);
    }

    // Mise à jour dans la base de données
    const updatedUtilisateur = await Utilisateur.findByIdAndUpdate(id, data, { new: true });

    if (!updatedUtilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json(updatedUtilisateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//############### delete user ##############################################
const deleteUtilisateur = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.user.id || req.user.id != id) {
      return res.status(403).json({ message: 'acces refusé 404' });
    }

    const utilisateur = await Utilisateur.findByIdAndDelete(id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur not found' });
    }
    res.status(200).json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
  res.redirect('/user/login');
  res.status(200).json({ message: 'logged out successfully' });
};

const existEmail = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ message: 'email invalide' });
    }

    console.log(email);
    const user = await Utilisateur.findOne({ email: email });
    console.log(user);
    return res.status(200).json({ exist: user ? true : false });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getUtilisateurs,
  getUtilisateurById,
  updateUtilisateur,
  deleteUtilisateur,
  registerUtilisateur,
  loginUser,
  logout,
  existEmail,
};
