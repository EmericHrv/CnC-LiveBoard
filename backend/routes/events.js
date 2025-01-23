import express from 'express';
import Event from '../models/event.model.js'; // Assurez-vous du chemin correct vers le modèle Event

const router = express.Router();

// Route : Ajouter un nouvel événement
router.post('/create', async (req, res) => {
    try {
        const { title, description, date, time } = req.body;

        if (!title || !date) {
            return res.status(400).json({ error: 'Title and date are required.' });
        }

        const newEvent = new Event({ title, description, date, time });
        await newEvent.save();

        res.status(201).json({ message: 'Event created successfully.', event: newEvent });
    } catch (error) {
        console.error('Error creating event:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route : Modifier un événement existant
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json({ message: 'Event updated successfully.', event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route : Supprimer un événement
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
        console.error('Error deleting event:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route : Récupérer tous les événements
router.get('/all', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 'asc' });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Route : Récupérer tous les événements
router.get('/upcoming', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10); // Si `limit` est défini, on le parse en entier

        // Obtenir le début et la fin de la journée actuelle
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Début du jour à 00:00:00

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Fin du jour à 23:59:59

        // Requête pour récupérer les événements :
        // - Ceux à partir de la journée actuelle (>= début de journée)
        // - Jusqu'à la fin des événements futurs
        const query = Event.find({
            date: { $gte: startOfDay },
        }).sort({ date: 'asc' });

        if (!isNaN(limit)) {
            query.limit(limit); // Appliquer une limite si spécifiée
        }

        const events = await query;
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Route générique pour récupérer un événement par son ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error.message);
        res.status(400).json({ error: 'Invalid event ID' });
    }
});

export default router;
