const Trajet = require('../models/trajet.model');
const Feedback = require('../models/feedback.model');
const Utilisateur = require('../models/utilisateur.model');

// Créer un feedback
exports.createFeedback = async (req, res) => {
  try {
    const { idTrajet, idPassager, note, description } = req.body;

    // Validation des données
    if (!idTrajet || !idPassager || !note) {
      return res.status(400).json({ message: 'Les champs idTrajet, idPassager et note sont requis.' });
    }  
    // Vérifier que la note est valide
    if (note < 1 || note > 5) {
        return res.status(400).json({ message: 'La note doit être entre 1 et 5.' });
      }
    // Vérifier si le trajet existe
    const trajet = await Trajet.findById(idTrajet);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    // Vérifier si le passager existe
    const passager = await Utilisateur.findById(idPassager);
    if (!passager) {
      return res.status(404).json({ message: 'Passager non trouvé' });
    }

    // Vérifier si le passager a déjà laissé un feedback pour ce trajet
    const existingFeedback = await Feedback.findOne({ idTrajet, idPassager });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un feedback pour ce trajet' });
    }

    // Créer le feedback
    const feedback = new Feedback({
      idTrajet,
      idPassager,
      note,
      description,
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error('Erreur lors de la création du feedback:', err);
    res.status(500).json({ message: 'Erreur interne du serveur.'});
  }
};

// Récupérer un feedback par ID
exports.getFeedbackById = async (req, res) => {
  try {
    const id = req.params.id;
    const feedback = await Feedback.findById(id)
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo');


    if (!feedback) {
      return res.status(404).json({ message: 'Feedback non trouvé' });
    }

    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo');

    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les feedbacks d'un trajet
exports.getFeedbacksByTrajet = async (req, res) => {
  try {
    const idTrajet = req.params.id;
    // Vérifier que le trajet existe
    const trajet = await Trajet.findById(idTrajet);
    if (!trajet) {
        return res.status(404).json({ message: 'Trajet non trouvé.' });
    }

    // Récupérer les feedbacks liés au trajet
    const feedbacks = await Feedback.find({ idTrajet })
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo');

  
    res.status(200).json(feedbacks);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Supprimer un feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const idFeedBack = req.params.id;

    // Vérifier que le feedback existe
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback non trouvé.' });
    }

    // Supprimer le feedback
    await Feedback.findByIdAndDelete(id);

    res.status(200).json({ message: 'Feedback supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les feedbacks d'un utilisateur
exports.getFeedbacksByPassager = async (req, res) => {
  try {
    const idPassager = req.params.id;

    // Récupérer les feedbacks liés à l'utilisateur
    const feedbacks = await Feedback.find({ idPassager: idPassager })
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo');

  
    res.status(200).json(feedbacks);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//Récupérer les feedbacks d'un conducteur
exports.getFeedbacksByConducteur = async (req, res) => {
  try {
    const idConducteur = req.params.id;

    // Récupérer les trajets du conducteur
    const trajets = await Trajet.find({ idConducteur });
    if (!trajets) {
      return res.status(404).json({ message: 'Trajets non trouvés' });
    }

    // Récupérer les feedbacks liés aux trajets du conducteur
    const feedbacks = await Feedback.find({ idTrajet: { $in: trajets.map(trajet => trajet._id) } })
    .populate('idPassager', 'nom prenom email photo sexe compteActif phone')
    .populate('idTrajet', 'pointDepart pointArrivee dateDepart heureDepart prixTrajet placesDispo');

  
    res.status(200).json(feedbacks);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Récupérer la moyenne des notes d'un conducteur
exports.getAverageNoteByConducteur = async (req, res) => {
  try {
    const idConducteur = req.params.id;

    // Récupérer les trajets du conducteur
    const trajets = await Trajet.find({ idConducteur });
    if (!trajets || trajets.length === 0) {
      return res.status(404).json({ message: 'Trajets non trouvés' });
    }

    // Récupérer les feedbacks liés aux trajets du conducteur
    const feedbacks = await Feedback.find({ idTrajet: { $in: trajets.map(trajet => trajet._id) } });
    if (!feedbacks || feedbacks.length === 0) {
      averageNote=0;
    }
    else
    {
      // Calculer la moyenne des notes
      const totalNotes = feedbacks.reduce((sum, feedback) => sum + feedback.note, 0);
      averageNote = totalNotes / feedbacks.length;
  
    }


    res.status(200).json({ averageNote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
