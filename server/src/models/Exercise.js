const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Exercise name is required'],
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['push', 'pull', 'legs', 'core', 'cardio', 'full_body']
        },
        muscleGroup: {
            type: String,
            required: true,
        },
        equipment: {
            type: String,
            default: 'bodyweight',
        },
        description: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);