const Reclamation = require('../models/reclamation.model');
const Utilisateur = require('../models/utilisateur.model'); // Assurez-vous que vous avez bien ce modèle pour valider les utilisateurs

// Création d'une réclamation
exports.createReclamation = async (req, res) => {
  try {
    const { utilisateurReclamant, utilisateurReclame, raison } = req.body;

    // Vérifier que les utilisateurs existent dans la base de données
    const userReclamant = await Utilisateur.findById(utilisateurReclamant);
    const userReclame = await Utilisateur.findById(utilisateurReclame);

    if (!userReclamant) {
      return res.status(404).json({ message: 'Utilisateur réclamant introuvable' });
    }

    if (!userReclame) {
      return res.status(404).json({ message: 'Utilisateur signalé introuvable' });
    }

    // Créer la réclamation
    const reclamation = new Reclamation({
      utilisateurReclamant,
      utilisateurReclame,
      raison,
    });

    const savedReclamation = await reclamation.save();
    res.status(201).json(savedReclamation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer toutes les réclamations (optionnel: ajouter un filtre par état ou utilisateur)
exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find()
      .populate('utilisateurReclamant', 'nom prenom email')  // Remplir les informations de l'utilisateur réclamant
      .populate('utilisateurReclame', 'nom prenom email')   // Remplir les informations de l'utilisateur signalé
      .exec();

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer une réclamation spécifique
exports.getReclamationById = async (req, res) => {
  try {
    idReclamation =req.params.id;
    const reclamation = await Reclamation.findById(idReclamation)
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    res.status(200).json(reclamation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour l'état et la réponse d'une réclamation (par un administrateur)
exports.updateReclamation = async (req, res) => {
  try {
    const { etat, reponse } = req.body;
    const { id } = req.params;

    // Vérification de l'état valide
    if (!['En cours', 'Traitée', 'Rejetée'].includes(etat)) {
      return res.status(400).json({ message: 'État invalide' });
    }

    // Trouver la réclamation
    const reclamation = await Reclamation.findById(id);

    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    // Mettre à jour les champs
    reclamation.etat = etat;
    if (etat === 'Traitée' && reponse) {
      reclamation.reponse = reponse;
      reclamation.dateTraitement = new Date();  // Ajouter la date de traitement
    }

    const updatedReclamation = await reclamation.save();
    res.status(200).json(updatedReclamation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une réclamation
exports.deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamation = await Reclamation.findByIdAndDelete(id);

    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    res.status(200).json({ message: 'Réclamation supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Traiter une réclamation
exports.traiterReclamation = async (req, res) => {
    try {
      const { id } = req.params;
      const { reponse } = req.body;
  
      const reclamation = await Reclamation
          .findById(id)
          .populate('utilisateurReclamant', 'nom prenom email')
          .populate('utilisateurReclame', 'nom prenom email');
  
      if (!reclamation) {
        return res.status(404).json({ message: 'Réclamation non trouvée' });
      }
  
      if (reclamation.etat !== 'En cours') {
        return res.status(400).json({ message: 'Réclamation déjà traitée ou rejetée' });
      }
  
      reclamation.etat = 'Traitée';
      reclamation.reponse = reponse;
      reclamation.dateTraitement = new Date();
  
      const updatedReclamation = await reclamation.save();
      res.status(200).json(updatedReclamation);
  
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  
};
  
//Rejeter une réclamation
exports.rejeterReclamation = async (req, res) => {
    try {
      const { id } = req.params;
      const { reponse } = req.body;
  
      const reclamation = await Reclamation
          .findById(id)
          .populate('utilisateurReclamant', 'nom prenom email')
          .populate('utilisateurReclame', 'nom prenom email');
  
      if (!reclamation) {
        return res.status(404).json({ message: 'Réclamation non trouvée' });
      }
  
      if (reclamation.etat !== 'En cours') {
        return res.status(400).json({ message: 'Réclamation déjà traitée ou rejetée' });
      }
  
      reclamation.etat = 'Rejetée';
      reclamation.reponse = reponse;
      reclamation.dateTraitement = new Date();
  
      const updatedReclamation = await reclamation.save();
      res.status(200).json(updatedReclamation);
  
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  
};

//Trouver les réclamations d'un utilisateur
exports.getReclamationsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclamant: id })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations signalées par un utilisateur
exports.getReclamationsSignalees = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclame: id })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations en cours
exports.getReclamationsEnCours = async (req, res) => {
  try {
    const reclamations = await Reclamation.find({ etat: 'En cours' })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations traitées
exports.getReclamationsTraitees = async (req, res) => {
  try {
    const reclamations = await Reclamation.find({ etat: 'Traitée' })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Trouver les réclamations rejetées
exports.getReclamationsRejetees = async (req, res) => {
  try {
    const reclamations = await Reclamation.find({ etat: 'Rejetée' })    
        .populate('utilisateurReclamant', 'nom prenom email')
        .populate('utilisateurReclame', 'nom prenom email');
    res.status(200).json(reclamations);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Trouver les réclamations traitées par un utilisateur
exports.getReclamationsTraiteesByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclamant: id, etat: 'Traitée' })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations en cours par un utilisateur
exports.getReclamationsEnCoursByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclamant: id, etat: 'En cours' })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations rejetées par un utilisateur
exports.getReclamationsRejeteesByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclamant: id, etat: 'Rejetée' })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations signalées par un utilisateur
exports.getReclamationsSignaleesByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclame: id })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations signalées par un utilisateur en cours
exports.getReclamationsSignaleesEnCours = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclame: id, etat: 'En cours' })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations signalées par un utilisateur traitées
exports.getReclamationsSignaleesTraitees = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclame: id, etat: 'Traitée' })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trouver les réclamations signalées par un utilisateur rejetées
exports.getReclamationsSignaleesRejetees = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamations = await Reclamation.find({ utilisateurReclame: id, etat: 'Rejetée' })
      .populate('utilisateurReclamant', 'nom prenom email')
      .populate('utilisateurReclame', 'nom prenom email');

    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

