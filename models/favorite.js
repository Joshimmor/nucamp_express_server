const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    "user": {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    "campsites": [
        {
            type: mongoose.Schema.ObjectId,
            ref: "campsites"
        }
    ]
});

exports.Favorites = mongoose.model('Favorties', favoriteSchema)