const router = require('express').Router();
const Tool = require('../models/user-posts-model');
const User = require('../models/user-model');
const mongoose = require('mongoose');

const db = mongoose.connection;

const authCheck = (req, res, next ) => {
    if(!req.user){
        // if user not logged in
        res.redirect('/auth/login');
    } else {
        // if logged in call
        next();
    }
}


router.get('/', (req, res) => {
    db.collection('tools').find().toArray((err, result) => {
        if (err) return console.log(err)
        // renders index.ejs
        res.render('tool', {user: req.user, tool: result})
      }) 
})

router.post('/', authCheck, (req, res) =>{
    let tool = new Tool({
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        contactInfo: req.body.contactInfo,
        seller : req.user.id
    })
    tool.save()
    .then(tool => {
        req.user.tools.push(tool)
        req.user.save()
        res.redirect('/profile')
    })
    .catch(err => {
        res.status(400).send('No Good')
    })
})



module.exports = router;