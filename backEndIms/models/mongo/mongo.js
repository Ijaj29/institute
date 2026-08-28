var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_URI || "mongodb://localhost:27017/ims";
var DB = process.env.MONGO_DB_NAME || "ims";
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

exports.insertDocument = function (document, collectionName, callback) {
    MongoClient.connect(url)
        .then(function (client) {
            var dbo = client.db(DB);
            return dbo.collection(collectionName)
                .insertOne(document)
                .then(function (result) {
                    callback(result);
                    client.close();
                })
                .catch(function (err) {
                    console.error("MongoDB insert error:", err);
                    client.close();
                    callback(null, err);
                });
        })
        .catch(function (err) {
            console.error("MongoDB connection error:", err);
            callback(null, err);
        });
};

exports.getNextRoleId = function (role, callback) {
    var normalizedRole = String(role).trim().toUpperCase();

    MongoClient.connect(url)
        .then(function (client) {
            var dbo = client.db(DB);
            return dbo.collection("counters").findOneAndUpdate(
                { _id: normalizedRole },
                { $inc: { sequence: 1 } },
                { upsert: true, returnDocument: "after" }
            )
                .then(function (counter) {
                    callback(normalizedRole + "-" + counter.sequence);
                    client.close();
                })
                .catch(function (err) {
                    console.error("MongoDB counter error:", err);
                    client.close();
                    callback(null, err);
                });
        })
        .catch(function (err) {
            console.error("MongoDB connection error:", err);
            callback(null, err);
        });
};

exports.queryWithAggregator = function (aggregate, collectionName, callback) {
        MongoClient.connect(url)
                .then(function (client) {
                        var dbo = client.db(DB);
                        return dbo.collection(collectionName)
                                .aggregate(aggregate, { allowDiskUse: true })
                                .toArray()
                                .then(function (result) {
                                        callback(result, null);
                                        client.close();
                                })
                                .catch(function (err) {
                                        console.error("Aggregation error:", err.message);
                                        console.error("Pipeline:", JSON.stringify(aggregate, null, 2));
                                        client.close();
                                        callback(null, err);
                                });
                })
                .catch(function (err) {
                        console.error("MongoDB connection error:", err);
                        callback(null, err);
                });
};