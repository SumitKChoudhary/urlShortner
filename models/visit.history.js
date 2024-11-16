const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const visitHistorySchema = new Schema({
    shortId:{
        type: String,
        require: true
    }
},
{
    timestamps: true
}
);

const VisitHistory = mongoose.model('visitHistory',visitHistorySchema);

module.exports = VisitHistory;