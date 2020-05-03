var express = require('express');
app = express();
var bodyParser = require('body-parser')

var multer = require('multer')
var upload = multer({ dest: 'images/uploads/' })

app.set("view engine", "ejs")
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/static"));
app.use('/images', express.static(__dirname + "/images"));
app.use(bodyParser.urlencoded({ extended: false }))

var loki = require('lokijs')
// var db = new loki('data.db');
// var items = db.addCollection('items');

var db = new loki("data.db", {
    autoload: true,
    autoloadCallback : databaseInitialize,
    autosave: true, 
    autosaveInterval: 4000
  });
  

function databaseInitialize() {
    var items = db.getCollection("items");

    if (items === null) {
        db.addCollection("items");
    }

}


app.get('/', function (req, res) {
    // db.removeCollection('items')
    // db.saveDatabase()
    const testFolder = 'images/uploads';
    const fs = require('fs');

    var data = db.getCollection("items").find({});
    console.log(data)
    res.render('index',{data:data})

})

app.get('/upload', function (req, res) {
    res.render('upload')
})

app.post('/uploadimage', upload.single('image'), function (req, res, next) {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = mm + '-' + dd + '-' + yyyy;
    db.getCollection("items").insert({ name: req.body.name, date: today, image: req.file["filename"] });
    db.saveDatabase()
    res.render('upload')

    // res.send(req.file)
})

app.listen(8080, function () {
    console.log("Server Started")
})