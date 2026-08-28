var mongo = require('../mongo/mongo');

exports.getUserDetailsByUserID = function (userId,callback) {
    mongo.queryFindAll({userid: userId},"users", function(response){
        callback(response);
    })
};

exports.addAnalyst = function (data,callback) {
    mongo.queryFindAll({ phone: data.phone }, "users", function (response) {
        if (response.length == 0) {
            var role = String(data.role || "ANALYST").trim().toUpperCase();

            mongo.getNextRoleId(role, function (userid, err) {
                if (err) {
                    callback("Unable to create user.");
                    return;
                }

                var data1 = {
                    role: role,
                    name: data.name,
                    phone: data.phone,
                    userid: userid,
                    status: "Active",
                    insertedOn: new Date(),
                    password: "b42458de550ef94801e7df33778c436d93bb78d3962f1020f3659db75b72cb8e3a4bb75f972c500d5a3626f74f6b69436d515b55a0344c4b29f28ad0cba56c3b"
                };
                mongo.insertDocument(data1, "users", function (response, insertErr) {
                    if (insertErr) {
                        callback("Unable to create user.");
                        return;
                    }
                    if (role == "ANALYST") {
                        var data2 = Object.assign({}, data, {
                            userid: userid,
                            status: "Active",
                            insertedOn: new Date()
                        });
                        mongo.insertDocument(data2, "analystMaster", function (masterResponse, masterErr) {
                            callback(masterErr ? "Unable to create analyst." : "user created succesfully.");
                        });
                        return;
                    }

                    callback("user created succesfully.");
                });
            });
        } else {
            callback("User already available.");
        }
    });
};

exports.getAnalyst = function (callback) {
    var aggregation = [
        { $match: { status:"Active" } },
        { $project: { _id: 0 } }
    ];
    mongo.queryWithAggregator(aggregation, "analystMaster", function (response, err) {
        callback(response || [], err);
    });
};

