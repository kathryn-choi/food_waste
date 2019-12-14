var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
var pi_table = "pi_data";
var user_table = "user_data";
var dynamodb = new AWS.DynamoDB();

function get_last_weight(ras_id,cb){
    params = {
        TableName : pi_table,
        ExpressionAttributeValues: {
            ":ras_id": {
            S: ras_id
            }
        },
        KeyConditionExpression : "ras_id = :ras_id",
        "ScanIndexForward":false
    }
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log(data.Items[0])
            var last_weight = data.Items[0].weight.N 
            console.log("Last Weight : ",last_weight)
            cb(last_weight)
        }
    });
}

module.exports = {
    save_pi_data: function(pi_data,cb){
        console.log(pi_data)
        get_last_weight(pi_data.ras_id,function(last_weight){
            console.log(last_weight)
            var diff_weight = pi_data.weight - last_weight;
            if(diff_weight < 0) diff_weight = 0;
            console.log(pi_data.date)
            var date = new Date(pi_data.date)
            date = date.getTime().toString()
            
            var params = {
                TableName : pi_table,
                Item : {
                    "ras_id" : pi_data.ras_id,
                    "save_date" :date,
                    "weight" : pi_data.weight,
                    "diff" : diff_weight
                }
            }
            console.log(params)
            docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    cb(false)
                } else {
                    console.log("Added item:", params);
                    cb(true)
                }
            });
        })
    },

    save_app_data: function(app_data,cb){
        // var app_data = JSON.parse(app_data);
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
                console.log("Added item:", params);
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
                console.log("GetItem succeeded:", data);
                // console.log(data.Item)
                if(data.Item){
                    params = {
                        TableName : pi_table,
                        ExpressionAttributeValues: {
                            ":ras_id": { S: data.Item.ras_id }
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
    },

    get_diff_data: function(user_info,cb){
        console.log(user_info)
        params = {
            TableName : pi_table,
            ExpressionAttributeValues: {
                ":ras_id": { S: user_info.ras_id},
                ":save_date" : {S : user_info.date}
            },
            KeyConditionExpression : "ras_id = :ras_id and save_date > :save_date",
        }
        dynamodb.query(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                JSON.stringify(data, null, 2)
                console.log(data.Items)
                cb(data.Items)
            }
        });
    }
}
