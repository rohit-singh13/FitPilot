const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    },
    setNumber: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    weightKg: {
        type: Number,
        default: 0
    },
    rpe: {
        type: Number,
        min: 1,
        max: 10
    }
});

const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true, // e.g. "Push Day", "Leg Day"
        },
        workoutDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        notes: {
            type: String,
        },
        sets: [setSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);