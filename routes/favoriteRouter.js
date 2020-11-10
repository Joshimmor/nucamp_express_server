const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const favoriteRouter = express.Router();
const cors = require('./cors')

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req, res) => res.sendStatus(200))
.get(cors.cors,
    authenticate.verifyUser, 
    (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    })
    .catch(err => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then( user  => {
        if(!user){
            Favorite.create(req.body)
            .then( favorites => {
                res.statusCode = 200;
                 res.setHeader('Content-Type', 'application/json');
                 res.json(favorites)
            })
            .catch(err => next(err))
        }else{
               let campsitesArray = req.body.campsites.forEach( campsite => {
                    if(!user.campsites.includes(campsite)){
                        user.campsites.push(campsite)
                    }
                })
                campsitesArray.save()
                .catch(err => next(err))
            }
    })
    .catch(err => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.setHeader('Content-Type','text/plain')
            res.send('Not supported.')
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.Favorites.findOneAndDelete(req.body.user)
    .then( resp => {
        if(!resp){
            res.statusCode = 200;
            res.setHeader('Content-Type','text/plain')
            res.send('You do not have any favorites to delete.')
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json')
            res.json(resp)
        }
    })
    .catch(err => next(err))
})


favoriteRouter.route('/:campsiteId')
.get(cors.cors,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain')
    res.send('Not supported.')
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne(req.body.user)
    .then( resp => {
        if(!resp){
            Favorite.create({user:req.body.user, campsites:[{_id: req.params.campsiteId}]})
        } else{
            if(!resp.campsites.includes(req.params.campsiteId)){
                let campsitesArray = resp.campsites.push({_id: req.params.campsiteId})
                campsitesArray.save()
                .catch(err => next(err))
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain')
                res.send('Campsite previously added')
            }
        }
    })
    .catch(err => next(err))    
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain')
    res.send('Not supported.')
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOne(req.body.user)
    .then( resp => {
        if(resp.campsites.includes({_id: req.params.campsiteId})){
            let campsitesArray = resp.campsites.filter(campsite => campsite._id != req.params.campsiteId)
            campsitesArray.save()
            .catch(err => next(err))
         }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','text/plain')
            res.send('Campsite Not in Favorites')
         }
       
    })
    .catch(err => next(err))
})

module.exports = favoriteRouter;