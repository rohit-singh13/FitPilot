const Exercise = require('../models/Exercise');

// @route GET /api/exercises
const getExercises = async (req, res, next) => {
    try{
        const exercises = await Exercise.find().sort({ name: 1 });
        res.json(exercises);
    } catch (error) {
        next(error);
    }
};

// @route POST /api/exercises
const createExercise = async (req, res, next) => {
    try {
        const { name, category, muscleGroup, equipment, description } = req.body;

        if(!name || !category || !muscleGroup) {
            res.status(400);
            throw new Error('Name, Category and Musclegroup are required');
        }

        const existing = await Exercise.findOne({ name });
        if(existing) {
            res.status(400);
            throw new Error('An exercise with this name already exists');
        }

        const exercise = await Exercise.create({
            name, category, muscleGroup, equipment, description 
        });
        res.status(201).json(exercise);
    } catch (error) {
        next(error);
    }
};

module.exports = { getExercises, createExercise };