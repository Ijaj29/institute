var mongo = require('../mongo/mongo');

exports.getUserDetailsByUserID = function (userId,callback) {
    mongo.queryFindAll({userid: userId},"users", function(response){
        callback(response);
    })
};



