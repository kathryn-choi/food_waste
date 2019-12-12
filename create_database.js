var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-west-2",
    endpoint : "http://localhost:8000"
})

var dynamodb = new AWS.DynamoDB();

var pi_data = 
{ 
    TableName: 'pi_data', 
    KeySchema: [ 
        { // Required 
            AttributeName: 'ras_id', 
            KeyType: 'HASH', 
        },
        { // Optional 
            AttributeName: 'date', 
            KeyType: 'RANGE', 
        }
    ], 
    AttributeDefinitions: [ 
        { 
            AttributeName: 'ras_id', 
            AttributeType: 'S', // (S | N | B) for string, number, binary 
        },
        { 
            AttributeName: 'date', 
            AttributeType: 'S', // (S | N | B) for string, number, binary 
        }
    ], 
    ProvisionedThroughput: { // required provisioned throughput for the table 
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1, 
    } 
}; 

var user_data = 
{ 
    TableName: 'user_data', 
    KeySchema: [ 
        { // Required 
            AttributeName: 'user_id', 
            KeyType: 'HASH', 
        }
    ], 
    AttributeDefinitions: [ 
        { 
            AttributeName: 'user_id', 
            AttributeType: 'S', // (S | N | B) for string, number, binary 
        }
    ], 
    ProvisionedThroughput: { // required provisioned throughput for the table 
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1, 
    } 
}; 


dynamodb.createTable(pi_data, function(err, data) { 
    if (err) { 
        console.log(err); // an error occurred 
    } else { 
        console.log(data); // successful response 
    } 
});

// dynamodb.createTable(user_data, function(err, data) { 
//     if (err) { 
//         console.log(err); // an error occurred 
//     } else { 
//         console.log(data); // successful response 
//     } 
// });