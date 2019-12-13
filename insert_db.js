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
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
}
async function save_random_data(epoch,start,end){
    var start_date = start;
    var start_weight = 0;
    for(var i =0; i<epoch; i++){
        console.log(start_date)
        var date =  await new Date(start_date.getTime() + Math.random() * (end.getTime() - start_date.getTime()));
        start_date = date
        if(start_weight == 2000)
            start_weight = 0
        var weight = await Math.floor(Math.random() * (2000-start_weight))+start_weight+1;
        start_weight = await weight
        var params = {
            TableName : "pi_data",
            Item : {
                "ras_id" : "pi1",
                "date" : date.toString(),
                "weight" : weight
            }
        }
        await add_data(params);

    }
}

save_random_data(10, new Date("2019-12-10"), new Date())
