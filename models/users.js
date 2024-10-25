const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Use PascalCase for clarity
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // Prevent duplicate emails
    },
    username: {
        type: String,
        required: true,
        unique: true // Prevent duplicate usernames
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt

// Integrate passport-local-mongoose
userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });

module.exports = mongoose.model('User', userSchema);

