const express = require('express')
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors({origin: 'http://localhost:4200'}));

var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectId;
var database;

// Local database URI.
const LOCAL_DATABASE = "mongodb://localhost:27017/products";
// Local port.
const LOCAL_PORT = 3000;
const COLLECTION = "products";

// Init the server
mongodb.MongoClient.connect(process.env.MONGODB_URI || LOCAL_DATABASE,
  {
      useUnifiedTopology: true,
      useNewUrlParser: true,
  }, function (error, client) {

      if (error) {
          console.log(error);
          process.exit(1);
      }

      database = client.db();
      console.log("Database connection done.");
      app.listen(LOCAL_PORT, () => {
          console.log(`app listening at http://localhost:${LOCAL_PORT}`)
        })
  });


// load all the products
app.get('/', (req, res) => {
  database.collection(COLLECTION).find({}).toArray(function (error, data) {
    if (error) {
        console.log("can not get products.");
    } else {
      console.log("status is success.");
        res.status(200).json(data);
    }
  });
});

// add a new product
app.post('/', (req, res) => {
  const prod = req.body;
  database.collection(COLLECTION).insertOne(prod, function (error, data) {
    if (error) {
        console.log("can not add a new product.");
    } else {
      console.log("added a new product success.");
        res.status(200).json(data);
    }
  });
});

// delete a product
app.delete('/:id', (req, res) => {  
  database.collection(COLLECTION).deleteOne({ _id: new ObjectID(req.params.id)}, function (error, data) {
    if (error) {
      console.log("can not delete a new product.");
    } else {
      console.log("deleted a product success.");
      res.status(200).json(data);
    }
  });
});