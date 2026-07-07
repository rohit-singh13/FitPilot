const express = require('express');
const {
    getSummary,
    getWeeklyVolume,
    getExerciseProgress,
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/weekly-volume', protect, getWeeklyVolume);
router.get('/exercise/:exerciseId', protect, getExerciseProgress);

module.exports = router;