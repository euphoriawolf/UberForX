var http            = require("http"),
    express         = require("express"),
    consolidate     = require("consolidate"),//1
    _               = require("underscore"),
    bodyParser      = require("body-parser"),
    routes          = require("./routes"),
    mongoClient     = require("mongodb").MongoClient;

var app = express();
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(bodyParser.json({limit: "5mb"}));
app.set("views", "views");
app.use(express.static("./public"));

app.set("view engine", "html");
app.engine("html", consolidate.underscore);
var server = http.Server(app);
var portNumber = 8000;

var io  = require("socket.io")(server);

server.listen(portNumber, function(){
    console.log('Server listening at port ' + portNumber);

    var url = "mongodb://localhost:27017/myUberApp";
    mongoClient.connect(url, function(err, db){
        console.log('conected to database');
        
        app.get("/citizen", function(req, res){
            res.render("citizen.html",{
                userId: req.query.userId
            });
        });
        app.get("/cop", function(req, res){
            res.render("cop.html",{
                userId: req.query.userId
            });
        });
        io.on("connection", function(socket){//listen on the 'connection' event for incoming sockets
            console.log("A user just connected");

            socket.on("join", function(data){//listen to any join event from connected users
                socket.join(data.userId);//user joins a unique room/channel that's named after the userId
                console.log("User joined room: " + data.userId);
            });
            routes.initialize(app, db, socket, io);//pass socket and io objects
        
        });
        

    });
});
