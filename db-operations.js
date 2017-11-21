function fetchNearestCops(db, coordinates, callback){
    db.collection("policeData").createIndex({
        "location": "2dsphere"
    }, function(){
        db.collection("policeData").find({
            location: {
                $near: {
                    $geometry:{
                        type: "Point",
                        coordinates: coordinates
                    },
                    $maxDistance: 2000
                }
            }
        }).toArray(function(err, results){
            if(err){
                console.log(err);
            }else{
                callback(results);
            }
        });
    });
}
function fetchCopDetails(db, userId, callback){
    db.collection("policeData").findOne({
        userId: userId
    }, function(err, results){
        if(err){
            console.log(err);
        }else{
            callback({
                copId: results.userId,
                displayName: results.displayName,
                phone: results.phone,
                location: results.location
            });
        }
    });
}

//saves details like citizen's location, time
function saveRequest(db, issueId, requestTime, location, citizenId, status, callback){
    db.collection("requestsData").insert({
        "_id": issueId,
        "requestTime": requestTime,
        "location": location,
        "citizenId": citizenId,
        "status": status
    }, function(err, results){
        if(err){
            console.log(err);
        }else{
            callback(results);
        }
    });

}

function updateRequest(db, requestId, copId, status, callback) {
    db.collection('requestsData').update({
        "_id": requestId //Perform update for the given requestId
    }, {
        $set: {
            "status": status, //Update status to 'engaged'
            "copId": copId  //save cop's userId
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback("Issue updated")
        }
    });
}


exports.updateRequest = updateRequest;
exports.saveRequest = saveRequest;
exports.fetchCopDetails = fetchCopDetails;
exports.fetchNearestCops = fetchNearestCops;