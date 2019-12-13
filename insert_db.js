var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-west-2",
    endpoint : "http://localhost:8000"
})

var docClient = new AWS.DynamoDB.DocumentClient();

function add_data(params){
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", params);
        }
    });
}
async function save_random_data(epoch,start,end){
    var start_date = start;
    var start_weight = 0;
    for(var i =0; i<epoch; i++){
        console.log(start_date)
        var date =  await start_date.getTime() + Math.random() * (end.getTime() - start_date.getTime());
        start_date = new Date(date)
        if(start_weight == 2000)
            start_weight = 0
        var weight = await Math.floor(Math.random() * (2000-start_weight))+start_weight+1;
        var diff = weight - start_weight
        if(start_weight == 0) diff = 0
        var params = {
            TableName : "pi_data",
            Item : {
                "ras_id" : "pi1",
                "save_date" : date.toString(),
                "weight" : weight,
                "diff" : diff
            }
        }
        await add_data(params);
        start_weight = await weight

    }
}

save_random_data(10, new Date("2019-12-10"), new Date())

