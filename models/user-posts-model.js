const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const toolSchema = new Schema({
    category: String,
    description: String,
    price: String,
    contactInfo: String,
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

const Tool = mongoose.model('tool', toolSchema);

module.exports = Tool;