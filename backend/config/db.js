let mongoose = require('mongoose');

require('dotenv').config();

module.exports = async function () {
    try {
        if (!process.env.ATLASDB) {
            throw new Error('ATLASDB environment variable is required');
        }
        await mongoose.connect(process.env.ATLASDB);
        console.log('MongoDB connected');
        return mongoose;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}