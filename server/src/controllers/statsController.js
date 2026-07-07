const Workout = require('../models/Workout');

// @route GET /api/stats/summary
// Returns overall totals: workout count, total sets, total volume lifted
const getSummary = async (req, res, next) => {
    try {
        const workouts = await Workout.find({ user: req.user._id });

        let totalSets = 0;
        let totalVolume = 0; // reps * weight, summed across all sets

        workouts.forEach((w) => {
            w.sets.forEach((s) => {
                totalSets += 1;
                totalVolume += s.reps * s.weightKg;
            });
        });

        res.json({
            totalWorkouts: workouts.length,
            totalSets,
            totalVolumeKg: totalVolume,
        });
    } catch (error) {
        next(error);
    }
};

// @route GET /api/stats/weekly-volume
// Returns total volume lifted per week, for the last 8 weeks
const getWeeklyVolume = async (req, res, next) => {
    try {
        const eightWeeksAgo = new Date();
        eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

        const workouts = await Workout.find({
            user: req.user._id,
            workoutDate: { $gte: eightWeeksAgo },
        });

        // Group by week (using the Monday of each week as the key)
        const weekMap = {};

        workouts.forEach((w) => {
            const date = new Date(w.workoutDate);
            const day = date.getDay();
            const monday = new Date(date);
            monday.setDate(date.getDate() - ((day + 6) % 7)); // back up to Monday
            const key = monday.toISOString().split('T')[0];

            const volume = w.sets.reduce((sum, s) => sum + s.reps * s.weightKg, 0);
            weekMap[key] = (weekMap[key] || 0) + volume;
        });

        const result = Object.entries(weekMap)
            .map(([weekStart, volume]) => ({ weekStart, volume }))
            .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// @route GET /api/stats/exercise/:exerciseId
// Returns progress history for one exercise (max weight per session, over time)
const getExerciseProgress = async (req, res, next) => {
    try {
        const { exerciseId } = req.params;

        const workouts = await Workout.find({
            user: req.user._id,
            'sets.exercise': exerciseId,
        }).sort({ workoutDate: 1 });

        const history = workouts.map((w) => {
            const relevantSets = w.sets.filter(
                (s) => s.exercise.toString() === exerciseId
            );
            const maxWeight = Math.max(...relevantSets.map((s) => s.weightKg));
            const totalReps = relevantSets.reduce((sum, s) => sum + s.reps, 0);

            return {
                date: w.workoutDate,
                maxWeightKg: maxWeight,
                totalReps,
                setCount: relevantSets.length,
            };
        });

        res.json(history);
    } catch (error) {
        next(error);
    }
};

module.exports = { getSummary, getWeeklyVolume, getExerciseProgress };