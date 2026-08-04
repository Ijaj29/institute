var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_URI || "mongodb://localhost:27017/ims";
var DB = process.env.MONGO_DB_NAME || "ims";
var autoIncrement = require('mongodb-autoincrement');
var Binary = require('mongodb').Binary;
var fs = require('fs');

exports.queryFindAll = function (myobj, collectionName, callback) {
    console.log(myobj);

    MongoClient.connect(url)
        .then(function (client) {
            var dbo = client.db(DB);
            return dbo.collection(collectionName)
                .find(myobj)
                .toArray()
                .then(function (result) {
                    callback(result);
                    client.close();
                })
                .catch(function (err) {
                    console.error("MongoDB query error:", err);
                    client.close();
                    callback([]);
                });
        })
        .catch(function (err) {
            console.error("MongoDB connection error:", err);
            callback([]);
        });
};
