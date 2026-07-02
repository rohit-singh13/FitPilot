const express = require('express');
const { getExercises, createExercise } = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getExercises);
router.post('/', protect, createExercise);

module.exports = router;
