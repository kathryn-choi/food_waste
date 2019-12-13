var express = require('express');
var router = express.Router();
var dynamo_access = require('./dynamodb.js') 


router.post('/app/save_data',function(req,res,next){
    var body = req.body;
    dynamo_access.save_app_data(body,function(response){
        console.log(response)
        if(response == true) res.status(200).json("Success")
        else res.status(500).json("Fail")
    });
})

router.get('/app/get_data/:id',function(req,res,next){
    dynamo_access.get_user_data(req.params.id,function(response){
        console.log(response)
        res.status(200).json(response)
    })
})

router.post('/app/get_diff_data',function(req,res,next){
    var body = req.body;
    console.log(body);
    dynamo_access.get_diff_data(body,function(response){
        console.log(response)
        res.status(200).json(response)
    })
})


router.post('/pi/save_data',function(req,res,next){
    var body = req.body;
    console.log(body);
    dynamo_access.save_pi_data(body,function(response){
        console.log(response)
        if(response == true) res.status(200).json("Success")
        else res.status(500).json("Fail")
    });
})
module.exports = router;