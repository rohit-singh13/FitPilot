const express = require('express');
const {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    addSetToWorkout,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createWorkout);
router.get('/', protect, getWorkouts);
router.get('/', protect, getWorkoutById);
router.put('/', protect, addSetToWorkout);

module.exports = router;