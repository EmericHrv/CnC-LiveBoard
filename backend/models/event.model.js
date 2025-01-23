import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    time: { type: String, default: '' }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
