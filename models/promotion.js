const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name: {
        type: String,
        require: true 
    },
    image : {
        type: String,
        require: true
    },
    featured: false,
    cost:{
        type: Currency,
        min: 0,
        required: true,
    },
    description: {
        type: String,
        require: true
    }
},{timestamps: true});

const Promotion = mongoose.model('Promotion', promotionSchema)
module.exports = Promotion