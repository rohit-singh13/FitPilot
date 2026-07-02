const Workout = require('../models/Workout');

// @route POST /api/workouts
const createWorkout = async (req, res, next) => {
    try {
        const { name, workoutDate, notes, sets } = req.body;

        if (!name) {
            res.status(400);
            throw new Error('Workout name is required');
        }

        const workout = await Workout.create({
            user: req.user._id,
            name,
            workoutDate: workoutDate || Date.now(),
            notes,
            sets: sets || [],
        });

        res.status(201).json(workout);
    } catch (error) {
        next(error);
    }
};

// @route GET /api/workouts  (only the logged-in user's own workouts)
const getWorkouts = async (req, res, next) => {
    try {
        const workouts = await Workout.find({ user: req.user._id })
            .sort({ workoutDate: -1 })
            .populate('sets.exercise', 'name category muscleGroup');

        res.json(workouts);
    } catch (error) {
        next(error);
    }
};

// @route GET /api/workouts/:id
const getWorkoutById = async (req, res, next) => {
    try {
        const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id })
            .populate('sets.exercise', 'name category muscleGroup');

        if (!workout) {
            res.status(404);
            throw new Error('Workout not found');
        }

        res.json(workout);
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/workouts/:id/sets  (add a set to an existing workout)
const addSetToWorkout = async (req, res, next) => {
    try {
        const { exercise, setNumber, reps, weightKg, rpe } = req.body;

        if (!exercise || !setNumber || !reps) {
            res.status(400);
            throw new Error('exercise, setNumber, and reps are required');
        }

        const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });

        if (!workout) {
            res.status(404);
            throw new Error('Workout not found');
        }

        workout.sets.push({ exercise, setNumber, reps, weightKg, rpe });
        await workout.save();

        res.status(201).json(workout);
    } catch (error) {
        next(error);
    }
};

module.exports = { createWorkout, getWorkouts, getWorkoutById, addSetToWorkout };