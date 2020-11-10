const express = require('express');
const bodyParser = require('body-parser');
const Promotion = require("../models/promotion");
const authenticate = require('../authenticate');
const promotionRouter = express.Router();
const cors = require('./cors');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.options(cors.corsWithOptions,(req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotions)
    })
    .catch(err => next(err))
})
.post(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
     (req, res, next) => {
    Promotion.create(req.body)
    .then(promotion =>{
        console.log('Promotion created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
    })
    .catch(err => next(err))
})
.put(cors.corsWithOptions,
    authenticate.verifyUser,
     (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
     (req, res, next) => {
    Promotion.deleteMany().
    then(response =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err))
});

//variable path
promotionRouter.route('/:promotionId')
    .options(cors.corsWithOptions,(req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Promotion.findById(req.params.promotionId)
       .then( promotion => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(promotion)
       })
       .catch(err => next(err))
    })
    .post(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
         (req,res) =>{
        res.end(`POST operation not supported on /partners`);
    })
    .put(cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
         (req,res, next) =>{
        Promotion.findByIdAndUpdate(req.params.promotionId,{
            $set:req.body
        },{new:true})
        .then(promotion => {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion)
        })
        .catch(err => next(err))
    })
    .delete(cors.corsWithOptions,
        authenticate.verifyUser, 
        authenticate.verifyAdmin,
        (req,res,next) =>{
        Promotion.findById(req.params.promotionId)
        .then(promotion => {
            promotion.remove()
            .then(() => {
                res.statusCode = 200;
                res.setHeader('Content-Type','text/html')
                res.end('Deleted')
            })
            .catch(err => next(err))
       })
       .catch(err => next(err))
    })

module.exports = promotionRouter;