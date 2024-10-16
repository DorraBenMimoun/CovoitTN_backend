const Trajet= require('../models/trajet.model.js');


/*const axios = require('axios');

async function getDistanceAndDurationFromOpenRouteService(pointDepart, pointArrivee) {
    const apiKey = '5b3ce3597851110001cf6248c123d2b11bb649b1b84f8eda41f463d3'; // Remplacez par votre clé API OpenRouteService
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pointDepart.lng},${pointDepart.lat}&end=${pointArrivee.lng},${pointArrivee.lat}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log("data: ", data);
        console.log("features: ", data.features);

        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const distance = feature.properties.summary.distance / 1000; // Distance en km
            const duration = feature.properties.summary.duration / 60;   // Durée en minutes
            return { distance, duration };
        } else {
            throw new Error('Impossible de calculer la distance et la durée - Aucune donnée trouvée.');
        }
    } catch (error) {
        console.error(`Erreur API: ${error.response ? error.response.status : 'Inconnu'} - ${error.message}`);
        if (error.response && error.response.data) {
            console.error(`Détails de l'erreur: ${JSON.stringify(error.response.data)}`);
        }
        throw new Error('Erreur lors de la communication avec l\'API OpenRouteService.');
    }
}
*/
/*exports.createTrajet2 = async (req, res) => {
    try {
        const { pointDepart, pointArrivee } = req.body;
        console.log("point depart: ", pointDepart);
        console.log("point arrivee: ", pointArrivee);

        if (!pointDepart || !pointDepart.lat || !pointDepart.lng) {
            return res.status(400).json({ message: "Les coordonnées du point de départ sont requises." });
        }

        if (!pointArrivee || !pointArrivee.lat || !pointArrivee.lng) {
            return res.status(400).json({ message: "Les coordonnées du point d'arrivée sont requises." });
        }

        // Obtenir la distance et la durée à partir de OpenRouteService
        const { distance, duration } = await getDistanceAndDurationFromOpenRouteService(pointDepart, pointArrivee);

        // Ajouter les valeurs calculées au corps de la requête
        req.body.distance = distance;
        req.body.duree = duration;

        // Créer et enregistrer le trajet
        const trajet = await Trajet.create(req.body);
        res.status(200).json(trajet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
*/

// Create and Save a new Trajet
exports.createTrajet = async (req, res) => {
    try{
         // S'assurer que les points de départ et d'arrivée contiennent les coordonnées lat et lng
         const { pointDepart, pointArrivee } = req.body;

         if (!pointDepart || !pointDepart.lat || !pointDepart.lng) {
             return res.status(400).json({ message: "Les coordonnées du point de départ sont requises." });
         }
 
         if (!pointArrivee || !pointArrivee.lat || !pointArrivee.lng) {
             return res.status(400).json({ message: "Les coordonnées du point d'arrivée sont requises." });
         }
        const trajet = await Trajet.create(req.body);
        res.status(200).json(trajet);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Retrieve all Trajets from the database.
exports.getTrajets = async (req, res) => {
    try{
        const trajets = await Trajet.find();
        res.status(200).json(trajets);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Find a single Trajet with an id
exports.getTrajetById = async (req, res) => {
    try{
        const id = req.params.id;
        const trajet = await Trajet.findById(id);
        res.status(200).json(trajet);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Update a Trajet by the id in the request
exports.updateTrajet = async (req, res) => {
    try{
        const id = req.params.id;
        const trajet = await Trajet.findByIdAndUpdate(id, req.body, {new: true});
        if(!trajet){
            res.status(404).json({message: 'Trajet not found'});
        }
        const updatedTrajet = await Trajet.findById(id);
        res.status(200).json(updatedTrajet);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }

}
// Delete a Trajet with the specified id in the request
exports.deleteTrajet = async (req, res) => {
    try{
        const id = req.params.id;
        const trajet = await Trajet.findByIdAndDelete(id);
        if(!trajet){
            res.status(404).json({message: 'Trajet not found'});
        }
        res.status(200).json(trajet);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Delete all Trajets from the database.    
exports.deleteAllTrajets = async (req, res) => {
    try{
        const trajets = await Trajet.deleteMany();
        res.status(200).json(trajets);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
exports.getTrajetsByConducteur= async (req, res) => {
    try{
        const id = req.params.id;
        const trajets = await Trajet.find({idConducteur: id});
        res.status(200).json(trajets);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

// Find all Trajets with a specific pointDepart
exports.getTrajetsByPointDepart = async (req, res) => {
    try {
        const { lat, lng } = req.body; // Utiliser query params pour obtenir les coordonnées
        if (!lat || !lng) {
            return res.status(400).json({ message: "Les coordonnées lat et lng du point de départ sont requises." });
        }

        const trajets = await Trajet.find({ "pointDepart.lat": lat, "pointDepart.lng": lng });
        res.status(200).json(trajets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Find all Trajets with a specific pointArrivee
exports.getTrajetsByPointArrivee = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        if (!lat || !lng) {
            return res.status(400).json({ message: "Les coordonnées lat et lng du point d'arrivée sont requises." });
        }

        const trajets = await Trajet.find({ "pointArrivee.lat": lat, "pointArrivee.lng": lng });
        res.status(200).json(trajets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Find all Trajets with a specific pointDepart and pointArrivee
exports.getTrajetsByPointDepartArrivee = async (req, res) => {
    try {
        console.log("depart",req.body)
        const { latDepart, lngDepart, latArrivee, lngArrivee } = req.body;
        if (!latDepart || !lngDepart || !latArrivee || !lngArrivee) {
            return res.status(400).json({ message: "Les coordonnées des points de départ et d'arrivée sont requises." });
        }

        const trajets = await Trajet.find({
            "pointDepart.lat": latDepart,
            "pointDepart.lng": lngDepart,
            "pointArrivee.lat": latArrivee,
            "pointArrivee.lng": lngArrivee
        });
        res.status(200).json(trajets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}





