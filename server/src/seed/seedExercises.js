require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const exerciseData = require('./exerciseData');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        let created = 0;
        let skipped = 0;

        for (const ex of exerciseData) {
            const existing = await Exercise.findOne({ name: ex.name });
            if (existing) {
                skipped += 1;
                continue;
            }
            await Exercise.create(ex);
            created += 1;
        }

        console.log(`Seeding complete: ${created} created, ${skipped} already existed.`);
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

run();