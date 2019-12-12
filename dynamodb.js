var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
var pi_table = "pi_data";
var user_table = "user_data";
var dynamodb = new AWS.DynamoDB();

module.exports = {
    

    save_pi_data: function(pi_data,cb){
        console.log(pi_data)
        // var pi_data = JSON.parse(pi_data);
        var params = {
            TableName : pi_table,
            Item : {
                "ras_id" : pi_data.ras_id,
                "date" : pi_data.date,
                "weight" : pi_data.weight
            }
        }
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                cb(false)
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                cb(true)
            }
        });
    },

    save_app_data: function(app_data,cb){
        var app_data = JSON.parse(app_data);
        var params = {
            TableName : user_table,
            Item : {
                "ras_id" : app_data.ras_id,
                "user_id" : app_data.user_id
            }
        }
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                cb(false)
            } else {
                console.log("Added item:", JSON.stringify(params, null, 2));
                cb(true)
            }
        });
    },

    get_user_data: function(user_id,cb){
        var params = {
            TableName : user_table,
            Key : {
                "user_id" : user_id
            }
        }
        console.log(user_id)
        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                // console.log(data.Item)
                if(data.Item){
                    params = {
                        TableName : pi_table,
                        ExpressionAttributeValues: {
                            ":ras_id": {
                            S: data.Item.ras_id
                            }
                        },
                        KeyConditionExpression : "ras_id = :ras_id"
                    }
                    dynamodb.query(params, function(err, data) {
                        if (err) {
                            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            JSON.stringify(data, null, 2)
                            // console.log(data.Items)
                            cb(data.Items) 
                        }
                    });
                }
                else{
                    cb("No User")
                }
            }
        });
    }
}
// var temp = {
//     "ras_id" : "eretregre",
//     "date" : "!23214324ewrew",
//     "weight" : 14
// }
// save_pi_data(JSON.stringify(temp))

// var temp = {
//         "ras_id" : "eretregre",
//         "user_id" : "modd"
// }

// save_app_data(JSON.stringify(temp))

// var temp = {
//     "ras_id" : "eretregre",
//     "user_id" : "modd"
// }
    
// get_user_data(JSON.stringify(temp))
    