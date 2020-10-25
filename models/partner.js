const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    name: {
        type: String,
        require: true 
    },
    image : {
        type: String,
        require: true
    },
    featured: false,
    description: {
        type: String,
        require: true
    }
},{timestamps: true});

const Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;