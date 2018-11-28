const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user-model');
const Tools = require('../models/user-posts-model');
const bodyParser = require('body-parser');
const db = mongoose.connection;
// Access Control Middleware Function
const authCheck = (req, res, next ) => {
    if(!req.user){
        // if user not logged in
        res.redirect('/auth/login');
    } else {
        // if logged in call
        next();
    }
}
const makeWork = {
    getTools: async(req, res, next) => {
        const tools =  await User.findById(req.user).populate('tools')
        res.render('profile', {user: req.user, tools: tools.tools})
        // db.collection('tools').find().toArray((err, result) => {
        //     if (err) return console.log(err)
        //     // renders index.ejs
        //     res.render('profile', {user: req.user, tool: result})
        //   }) 
    },
    findTools: async(req, res, next) => {
        
        const tools = await Tools.findById(req.query.id)
        res.render('tools', {user: req.user, tools: tools})
    }
    
}

const tool_update = function (req, res) {
    Tools.findByIdAndUpdate(req.params.id, {$set: req.body}, 
        function(err, product) {
            if(err) return next(err);
            res.redirect('/profile/');
        })
}

const tool_delete = function(req, res) {
    Tools.findByIdAndRemove(req.params.id, function(err) {
        if(err) return next(err);
        res.redirect('/profile');
    })
}

router.get('/', authCheck, makeWork.getTools)

router.get('/tools', authCheck, makeWork.findTools)

router.post('/tools/:id', tool_update);

router.post('/tools/:id/delete', tool_delete);

module.exports = router;