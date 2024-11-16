const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlSchema = new Schema({
    shortId:{
        type: String,
        require: true,
        unique: true
    },
    redirectUrl:{
        type: String,
        required: true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visitHistory: [{timestamp: {type: Date}}],
},
{
    timestamps: true
}
);

const URL = mongoose.model('url', urlSchema);

module.exports = URL;