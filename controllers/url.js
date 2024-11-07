const shortid = require('shortid');

const URL = require('../models/url');
const User = require('../models/user');

exports.generateShortURL = (req, res, next)=>{
    const shortId = shortid(10);
    const redirectUrl = req.body.url;
    let creator;
    if(!redirectUrl){
        const error = new Error('URL required');
        error.statusCode = 400;
        throw error;
    }

    const url = new URL({
        shortId: shortId,
        redirectUrl: redirectUrl,
        creator: req.userId,
        visitHistory: []
    }); 
    
    url.save().then(result=>{
        return User.findById(req.userId);
    }).then(user=>{
        creator=user;
        user.url.push(url);
        return user.save();
    }).then(result=>{
        res.status(201).json({
            message: 'URL shortened successfully',
            url: url,
            creator: {_id:creator._id, name:creator.name}
        });
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });

};

exports.redirectToOriginalURL = (req, res, next)=>{
    const shortId =  req.params.shortId;
    URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory: {
                timestamp:Date.now()
            }
        }
    }).then(result=>{
        res.redirect(result.redirectUrl);
    }
    ).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
    
};