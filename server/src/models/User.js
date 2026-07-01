const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: 6
        },
        heightCm: { type: Number},
        weightKg: { type: Number},
        fitnessGoal: {
            type: String,
            enum: [
                'weight_lose','weight_gain', 'build_muscle', 'improve_endurance', 'general_fitness'
            ],
            default: 'general_fitness'
        },
        experienceLevel: {
            type: String,
            enum: [
                'beginner', 'intermediate', 'Advance'
            ],
            default: 'beginner',
        }
    },
    { timestamps: true} // adds createdAt, updatedAt automatically
);

module.exports = mongoose.model('User', userSchema);