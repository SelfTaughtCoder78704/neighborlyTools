const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    googleId: String,
    email: String,
    thumbnail: String,
    tools: [{
        type: Schema.Types.ObjectId,
        ref: 'tool'
    }]
});

const User = mongoose.model('user', userSchema);

module.exports = User;