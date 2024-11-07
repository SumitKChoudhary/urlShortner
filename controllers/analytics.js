const URL = require('../models/url');

exports.getURLAnalytics=(req,res,next)=>{
    const shortId = req.params.shortId;
    URL.findOne({shortId}).then(result=>{
        res.status(200).json({
        totalClick:result.visitHistory.length,
        analytics:result.visitHistory
        });
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};