const express = require("express");

const app = express();
const mongodb = require("mongodb").MongoClient;
let database;

app.use(express.json());

const cors = require("cors");
mongodb.connect("mongodb+srv://Root:Root@cluster0.sd8cz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
function(error, client){
    database = client.db('webstore')
    console.log("database connected");
})
app.use(cors())
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', '*');
    next();
})
app.param("collectionName", (request, response, next, collectionName) => {
    request.collection = database.collection(collectionName);
    return next();
});
// route to GET index page
app.get("/", (request, response, next) => {
    response.send("welcome to coursework sever");
    next();
});

// route to GET all items in a collection
app.get("/collection/:collectionName", (request, response, next) => {
    request.collection.find({}).toArray((err, res) => {
        if (err) return next(err);
        response.send(res);
    })
});
app.post("/collection/:collectionName", (request, response, next) => {
    request.collection.insert(request.body, (err, res) => {
       if (err) return next(err);
       if(res.ops !== null){
           let result = {"message": "success"}
           response.send(result);
       }
       //console.log(request.body);
    });
})
app.listen(3000, function(){
    console.log("app running");
})