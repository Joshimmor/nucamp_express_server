const express = require('express');
const bodyParser = require('body-parser');
const Campsite = require('../models/campsite');

const campsiteRouter = express.Router();

campsiteRouter.use(bodyParser.json());

campsiteRouter.route('/')
.get((req, res, next) => {
    Campsite.find()
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite)
    })
    .catch(err => next(err))
})
.post((req, res, next ) => {
    Campsite.create(req.body)
    .then(campsite => {
        console.log('Campsite created', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err))
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next) => {
    Campsite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err))
});

//variable path
campsiteRouter.route('/:campsiteId')
    .get((req,res, next) =>{
       Campsite.findById(req.params.campsiteId)
       .then(campsite => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(campsite);
       })
       .catch(err => next(err))
    })
    .post((req,res, next) =>{
       res.statusCode = 403;
       res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
    })
    .put((req,res, next) =>{
        Campsite.findByIdAndUpdate(req.params.campsiteId, {
            $set: req.body
        },{mew : true})
        .then(campsite => {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite)
        })
        .catch(err => next(err))
    })
    .delete((req, res, next) => {
        Campsite.findByIdAndDelete(req.params.campsiteId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });
    //variable path to comment path
    campsiteRouter.route('/:campsiteId/comments')
    .get((req,res, next) => {
       Campsite.findById(req.params.campsiteId)
       .then(campsite => {
           if(campsite){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite.comments);
           }else{
                err = new Error(`Campsite ${req.params.campsiteId} not found.`);
                err.status = 404;
                return next(err);
           }
       })
       .catch(err => next(err))
    })
    .post((req,res, next) =>{
       Campsite.findById(req.params.campsiteId)
       .then(campsite => {
           if(campsite){
               campsite.comments.push(req.body);
               campsite.save()
               .then(campsite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(campsite);
               })
               .catch(err => next(err));
            }else{
                err = new Error(`Campsite ${req.params.campsiteId} not found.`);
                err.status = 404;
                return next(errr)
            }
       })
       .catch(err => next(err));
    })
    .put((req,res) =>{
        res.statusCode = 403;
        res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`)
    })
    .delete((req, res, next) => {
        Campsite.findById(req.params.campsiteId)
        .then(campsite => {
            if(campsite){
                for(let i = (campsite.comments.length-1 ); i > 0; i--){
                    campsite.comments.id(campsite.comments[i]._id).remove();
                }
                campsite.save()
                .then(campsite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(campsite);
                })
                .cath(err => next(err));
            }else{
                err - new Error(`Campsite ${req.params.campsiteId} not found.`);
                err.status = 404;
                return next(err)
            }
        })
        .catch(err => next(err));
    });
    //variable campsite to comments to variable comment
    campsiteRouter.route('/:campsiteId/comments/:commentId')
    .get((req,res, next) =>{
       Campsite.findById(req.params.campsiteId)
       .then(campsite => {
           if(campsite && campsite.comments.id(req.params.commentId)){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite.comments.id(req.params.campsiteId));
           }else if(!campsite){
                err = new Error(`Campsite ${req.params.campsiteId} not found.`);
                err.status = 404;
                return next(err);
           }else{
            err = new Error(`Comment ${req.params.commentId} not found.`);
            err.status = 404;
            return next(err);
       }
       })
       .catch(err => next(err))
    })
    .post((req,res) =>{
        res.statusCode = 403;
        res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments`);
    })
    .put((req,res,next) =>{
        Campsite.findById(req.params.campsiteId)
        .then(campsite => {
            if(campsite && campsite.comments.id(req.params.comments)){
                if(req.body.text){
                    campsite.comments.id(req.params.commentId) = req.body.text
                }
                if(req.body.rating){
                    campsite.comments.id(req.params.commentId) = req.body.rating
                }
                campsite.save()
                .then(campsite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(campsite);
                })
                .catch(err => next(err));
            }else if(!campsite){
                err = new Error(`Campsite ${req.params.campsiteId} not found.`)
                err.status = 404;
                return next(err);
            }else{
                err = new Error(`Comment ${req.params.commentId} not found.`)
            }
        })
        .catch( err => next(err));
    })
    .delete((req, res, next) => {
        Campsite.findById(req.params.campsiteId)
        .then(campsite => {
            if(campsite && campsite.comments.id(req.params.commentId)){
                campsite.commentId.id(req.params.commentId).remove();
                campsite.save()
                .then(campsite => {
                    res.statusCode = 200;
                    res.setHeader('Comtent-Type','application/json')
                    res.json(campsite)
                })
                .catch(err => next(err));
            }else if(!campsite){
                err = new Error(`Campsite ${req.params.campsiteId} not found.`)
                err.status = 404;
                return next(err)
            }else{
                err = new Error(`Comment ${req.params.commentId} not found.`)
                err.status = 404;
                return next(err)
            }
        })
        .catch(err => next(err));
        
    });


module.exports = campsiteRouter;